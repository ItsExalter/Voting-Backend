const Event = require('../../models/Event');
const User = require('../../models/User');

describe('Event Model', () => {
  test('should create event with required fields', async () => {
    const user = await User.create({
      username: 'eventcreator',
      password: 'password123',
      role: 'admin'
    });

    const event = new Event({
      title: 'Test Event',
      createdBy: user._id
    });

    await event.save();
    expect(event.title).toBe('Test Event');
    expect(event.status).toBe('active');
  });

  test('should require title field', async () => {
    const event = new Event({});
    await expect(event.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});