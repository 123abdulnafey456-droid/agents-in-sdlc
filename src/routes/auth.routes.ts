import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, firstName, lastName } = req.body;
      const result = await AuthService.register(
        email,
        password,
        firstName,
        lastName
      );

      res.status(201).json({
        message: 'User registered successfully',
        token: result.token,
        user: {
          id: result.user._id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
        },
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.json({
        message: 'Login successful',
        token: result.token,
        user: {
          id: result.user._id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
        },
      });
    } catch (error) {
      res.status(401).json({
        error: (error as Error).message,
      });
    }
  }
);

// Refresh Token
router.post('/refresh', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }

    const newToken = await AuthService.refreshToken(token);
    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
    });
  } catch (error) {
    res.status(401).json({
      error: (error as Error).message,
    });
  }
});

// Get Current User
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  res.json({
    user: req.user,
  });
});

export default router;
