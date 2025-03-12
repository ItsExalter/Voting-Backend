const Vote = require('../../models/Vote');
const Event = require('../../models/Event');
const User = require('../../models/User');

describe('Vote Model', () => {
  test('should create vote with required fields', async () => {
    const user = await User.create({
      username: 'voter',
      password: 'password123',
      role: 'user'
    });

    const event = await Event.create({
      title: 'Voting Event',
      createdBy: user._id
    });

    const vote = new Vote({
      event: event._id,
      option: 'Option 1',
      voter: user._id
    });

    await vote.save();
    expect(vote.option).toBe('Option 1');
  });

  test('should require event and option fields', async () => {
    const vote = new Vote({});
    await expect(vote.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});