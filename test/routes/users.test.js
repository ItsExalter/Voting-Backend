const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');

describe('User Routes', () => {
  let adminToken;

  beforeAll(async () => {
    await User.create({
      username: 'admin',
      password: 'adminpass',
      role: 'admin'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'adminpass' });
    
    adminToken = res.body.token;
  });

  test('GET /api/users - admin access', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('POST /api/users - create new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'newuser', password: 'newpass', role: 'user' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.user.username).toBe('newuser');
  });
});