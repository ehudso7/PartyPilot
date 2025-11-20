import bcrypt from 'bcryptjs';
import { registerUser, loginUser } from '../../../modules/auth/service';
import prisma from '../../../db/prismaClient';

jest.mock('../../../db/prismaClient', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should create new user with hashed password', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        phone: null,
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: 'hashed-password',
      });

      const result = await registerUser(
        'test@example.com',
        'Password123',
        'Test User'
      );

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'test@example.com',
            name: 'Test User',
          }),
        })
      );
    });

    it('should throw error if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-id',
        email: 'test@example.com',
      });

      await expect(
        registerUser('test@example.com', 'Password123', 'Test User')
      ).rejects.toThrow('Email already registered');
    });

    it('should hash password with bcrypt', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        phone: null,
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockImplementation(async ({ data }) => {
        const isValidHash = await bcrypt.compare('Password123', data.password);
        expect(isValidHash).toBe(true);
        return { ...mockUser, password: data.password };
      });

      await registerUser('test@example.com', 'Password123', 'Test User');
    });
  });

  describe('loginUser', () => {
    it('should return user and token with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 12);
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        phone: null,
        password: hashedPassword,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await loginUser('test@example.com', 'Password123');

      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error for non-existent user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        loginUser('nonexistent@example.com', 'Password123')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword', 12);
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        password: hashedPassword,
        deletedAt: null,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        loginUser('test@example.com', 'WrongPassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for deleted user', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        password: 'hashed',
        deletedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        loginUser('test@example.com', 'Password123')
      ).rejects.toThrow('Account has been deleted');
    });
  });
});
