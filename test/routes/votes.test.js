const request = require('supertest');
const app = require('../../server');
const Event = require('../../models/Event');
const User = require('../../models/User');
const Vote = require('../../models/Vote');

describe('Vote Routes', () => {
  let userToken, eventId;

  beforeAll(async () => {
    const user = await User.create({
      username: 'voter',
      password: 'password123',
      role: 'user'
    });

    const event = await Event.create({
      title: 'Voting Event',
      createdBy: user._id
    });

    eventId = event._id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'voter', password: 'password123' });
    
    userToken = res.body.token;
  });

  test('POST /api/votes - submit vote', async () => {
    const res = await request(app)
      .post('/api/votes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ eventId, option: 'Option 1' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.option).toBe('Option 1');
  });

  test('GET /api/votes/results/:eventId - get results', async () => {
    const res = await request(app)
      .get(`/api/votes/results/${eventId}`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});