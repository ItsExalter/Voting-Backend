const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');

describe('Auth Routes', () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    server = app.listen(3001, () => console.log('Test server running on port 3001'));
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await User.create({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });
  });

  test('POST /api/auth/login - success', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrong' });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid credentials');
  });
});