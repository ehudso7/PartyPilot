import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { requireAuth, generateToken, JWTPayload } from '../../../middleware/auth';
import { config } from '../../../config/env';

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('requireAuth', () => {
    it('should reject request without authorization header', () => {
      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'No authorization token provided',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid authorization format', () => {
      mockReq.headers = { authorization: 'InvalidFormat token' };

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept request with valid token', () => {
      const payload: JWTPayload = {
        userId: 'test-user-id',
        email: 'test@example.com',
      };

      const token = generateToken(payload);
      mockReq.headers = { authorization: `Bearer ${token}` };

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect((mockReq as any).userId).toBe(payload.userId);
      expect((mockReq as any).userEmail).toBe(payload.email);
    });

    it('should reject expired token', () => {
      const payload: JWTPayload = {
        userId: 'test-user-id',
        email: 'test@example.com',
      };

      const expiredToken = jwt.sign(payload, config.jwtSecret, {
        expiresIn: '-1h',
      });

      mockReq.headers = { authorization: `Bearer ${expiredToken}` };

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token expired' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('generateToken', () => {
    it('should generate valid JWT token', () => {
      const payload: JWTPayload = {
        userId: 'test-user-id',
        email: 'test@example.com',
      };

      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    it('should throw error if JWT_SECRET not configured', () => {
      const originalSecret = config.jwtSecret;
      (config as any).jwtSecret = '';

      const payload: JWTPayload = {
        userId: 'test-user-id',
        email: 'test@example.com',
      };

      expect(() => generateToken(payload)).toThrow('JWT_SECRET not configured');

      (config as any).jwtSecret = originalSecret;
    });
  });
});
