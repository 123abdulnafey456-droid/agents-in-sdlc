import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '7d';

export interface AuthPayload {
  id: string;
  email: string;
}

export class AuthService {
  static generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
  }

  static verifyToken(token: string): AuthPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ user: IUser; token: string }> {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
    });

    await user.save();

    const token = this.generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    return { user, token };
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    return { user, token };
  }

  static async refreshToken(token: string): Promise<string> {
    const payload = this.verifyToken(token);
    return this.generateToken(payload);
  }
}
