// tests/middleware/auth.test.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const auth = require('./../../middleware/auth');
const User = require('../../models/User');
require("dotenv").config();

describe('Auth Middleware', () => {
  let user, validToken;
  const mockRequest = (headers = {}) => ({
    header: jest.fn().mockImplementation(name => headers[name])
  });
  const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  });
  const mockNext = jest.fn();

  beforeAll(async () => {
    // Create test user
    user = await User.create({
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });
    
    // Generate valid token
    validToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should authenticate with valid token', async () => {
    const req = mockRequest({
      Authorization: `Bearer ${validToken}`
    });
    const res = mockResponse();

    await auth.auth(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.user._id).toEqual(user._id);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should reject missing token', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await auth.auth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Please authenticate'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should reject invalid token', async () => {
    const req = mockRequest({
      Authorization: 'Bearer invalidtoken'
    });
    const res = mockResponse();

    await auth.auth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Please authenticate'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should reject valid token for non-existent user', async () => {
    // Create token for non-existent user
    const fakeUserId = new mongoose.Types.ObjectId();
    const token = jwt.sign(
      { _id: fakeUserId },
      process.env.JWT_SECRET
    );

    const req = mockRequest({
      Authorization: `Bearer ${token}`
    });
    const res = mockResponse();

    await auth.auth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Please authenticate'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should handle malformed authorization header', async () => {
    const req = mockRequest({
      Authorization: 'InvalidHeaderFormat'
    });
    const res = mockResponse();

    await auth.auth(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Please authenticate'
    });
  });
});