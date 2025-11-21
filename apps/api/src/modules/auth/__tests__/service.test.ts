import { registerUser, loginUser, getUserById } from '../service';
import prisma from '../../../db/prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../../../db/prismaClient', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('../../../config/env', () => ({
  config: {
    jwtSecret: 'test-secret-key-for-testing',
  },
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        phone: null,
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await registerUser('test@example.com', 'password123', 'Test User');

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
          name: 'Test User',
          phone: null,
        }),
        select: expect.any(Object),
      });
    });

    it('should throw error if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email: 'test@example.com',
      });

      await expect(
        registerUser('test@example.com', 'password123', 'Test User')
      ).rejects.toThrow('Email already registered');

      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should hash password before storing', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        phone: null,
        createdAt: new Date(),
      });

      await registerUser('test@example.com', 'password123', 'Test User');

      const createCall = (prisma.user.create as jest.Mock).mock.calls[0][0];
      const hashedPassword = createCall.data.password;

      expect(hashedPassword).not.toBe('password123');
      expect(hashedPassword.length).toBeGreaterThan(20);
      expect(await bcrypt.compare('password123', hashedPassword)).toBe(true);
    });

    it('should include phone number if provided', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        createdAt: new Date(),
      });

      const result = await registerUser('test@example.com', 'password123', 'Test User', '+1234567890');

      expect(result.user.phone).toBe('+1234567890');
    });
  });

  describe('loginUser', () => {
    it('should successfully login with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        phone: null,
        createdAt: new Date(),
        deletedAt: null,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await loginUser('test@example.com', 'password123');

      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        phone: mockUser.phone,
        createdAt: mockUser.createdAt,
      });
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    it('should throw error if user does not exist', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        loginUser('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 12);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'test-id',
        email: 'test@example.com',
        password: hashedPassword,
        deletedAt: null,
      });

      await expect(
        loginUser('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if user is deleted', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'test-id',
        email: 'test@example.com',
        password: hashedPassword,
        deletedAt: new Date(),
      });

      await expect(
        loginUser('test@example.com', 'password123')
      ).rejects.toThrow('Account has been deleted');
    });

    it('should return valid JWT token', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        phone: null,
        createdAt: new Date(),
        deletedAt: null,
      });

      const result = await loginUser('test@example.com', 'password123');

      const decoded = jwt.verify(result.token, 'test-secret-key-for-testing') as any;
      expect(decoded.userId).toBe('test-user-id');
      expect(decoded.email).toBe('test@example.com');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserById('test-id');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        select: expect.any(Object),
      });
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(getUserById('nonexistent-id')).rejects.toThrow('User not found');
    });
  });
});
