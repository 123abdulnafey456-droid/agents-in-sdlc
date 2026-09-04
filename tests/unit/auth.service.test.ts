import { AuthService } from '../services/auth.service';
import { User } from '../models/User';

// Mock User model
jest.mock('../models/User');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { id: '123', email: 'test@example.com' };
      const token = AuthService.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { id: '123', email: 'test@example.com' };
      const token = AuthService.generateToken(payload);
      const verified = AuthService.verifyToken(token);

      expect(verified.id).toBe(payload.id);
      expect(verified.email).toBe(payload.email);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        AuthService.verifyToken('invalid-token');
      }).toThrow();
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        _id: '123',
        email: 'newuser@example.com',
        firstName: 'John',
        lastName: 'Doe',
        save: jest.fn().mockResolvedValue({}),
      };

      (User as jest.Mock).mockImplementation(() => mockUser);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await AuthService.register(
        'newuser@example.com',
        'password123',
        'John',
        'Doe'
      );

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should throw error if user already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: 'existing@example.com',
      });

      await expect(
        AuthService.register('existing@example.com', 'password123', 'John', 'Doe')
      ).rejects.toThrow('User already exists');
    });
  });
});
