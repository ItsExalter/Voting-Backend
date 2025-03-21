const User = require('../../models/User');
const mongoose = require('mongoose');

describe('User Model', () => {
  test('should create user with hashed password', async () => {
    const user = new User({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });
    
    await user.save();
    expect(user.password).not.toBe('password123');
    expect(user.password).toHaveLength(60);
  });

  test('should require unique username', async () => {
    await User.create({ username: 'test', password: 'pass', role: 'user' });
    await expect(User.create({ username: 'test', password: 'pass', role: 'user' }))
      .rejects.toThrow(mongoose.Error.MongoServerError);
  });

  test('should require valid role', async () => {
    const user = new User({
      username: 'testuser',
      password: 'password123',
      role: 'invalidRole'
    });
    
    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});