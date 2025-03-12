const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const Event = require('../../models/Event');
const Vote = require('../../models/Vote');

describe('Full System Flow', () => {
  let adminToken, userToken, eventId;

  beforeAll(async () => {
    // Create admin and user
    await User.create([
      { username: 'flowadmin', password: 'adminpass', role: 'admin' },
      { username: 'flowuser', password: 'userpass', role: 'user' }
    ]);

    // Get tokens
    adminToken = (await request(app)
      .post('/api/auth/login')
      .send({ username: 'flowadmin', password: 'adminpass' })).body.token;

    userToken = (await request(app)
      .post('/api/auth/login')
      .send({ username: 'flowuser', password: 'userpass' })).body.token;
  });

  test('Complete voting lifecycle', async () => {
    // 1. Create event
    const createRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Integration Event',
        options: ['A', 'B'],
        allowCustomOptions: true
      });
    eventId = createRes.body._id;
    expect(createRes.statusCode).toBe(201);

    // 2. Submit votes
    const vote1 = await request(app)
      .post('/api/votes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ eventId, option: 'A' });
    expect(vote1.statusCode).toBe(201);

    const vote2 = await request(app)
      .post('/api/votes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ eventId, option: 'C' }); // Custom option
    expect(vote2.statusCode).toBe(201);

    // 3. Get results as user
    const userResults = await request(app)
      .get(`/api/votes/results/${eventId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(userResults.body).toHaveLength(3); // A, B, C

    // 4. Close event
    const closeRes = await request(app)
      .patch(`/api/events/${eventId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'closed' });
    expect(closeRes.body.status).toBe('closed');

    // 5. Attempt to vote on closed event
    const closedVote = await request(app)
      .post('/api/votes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ eventId, option: 'A' });
    expect(closedVote.statusCode).toBe(400);

    // 6. Verify admin results
    const adminResults = await request(app)
      .get(`/api/votes/results/${eventId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminResults.body.summary).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ option: 'A', count: 1 }),
        expect.objectContaining({ option: 'C', count: 1 })
      ])
    );
  });
});