const request = require('supertest');
const app = require('../../server');
const Event = require('../../models/Event');
const User = require('../../models/User');

describe('Event Routes', () => {
  let adminToken;

  beforeAll(async () => {
    await User.create({
      username: 'eventadmin',
      password: 'adminpass',
      role: 'admin'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'eventadmin', password: 'adminpass' });
    
    adminToken = res.body.token;
  });

  test('POST /api/events - create new event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'New Event' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Event');
  });

  test('GET /api/events/active - get active events', async () => {
    const res = await request(app).get('/api/events/active');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});