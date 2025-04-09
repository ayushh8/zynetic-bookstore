import mongoose from 'mongoose';
import { User } from './user.model';

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/bookstore-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user with hashed password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();

    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Password should be hashed
  });

  it('should not allow duplicate emails', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    // Create first user
    await new User(userData).save();

    // Try to create second user with same email
    try {
      await new User(userData).save();
      fail('Should have thrown an error for duplicate email');
    } catch (error: any) {
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    }
  });

  it('should compare passwords correctly', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();

    // Test correct password
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);

    // Test incorrect password
    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });
}); 