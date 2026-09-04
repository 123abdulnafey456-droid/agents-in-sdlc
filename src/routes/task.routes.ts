import { Router, Response } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { TaskService } from '../services/task.service';

const router = Router();

// Create task
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty(),
    body('description').optional().trim(),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high']),
    body('dueDate').optional().isISO8601(),
    body('tags').optional().isArray(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, priority, dueDate, tags } = req.body;
      const userId = req.user?.id || '';

      const task = await TaskService.createTask(
        userId,
        title,
        description || '',
        priority || 'medium',
        dueDate ? new Date(dueDate) : undefined,
        tags || []
      );

      res.status(201).json({
        message: 'Task created',
        task,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Get all tasks
router.get(
  '/',
  authenticate,
  [query('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled'])],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user?.id || '';
      const { status } = req.query;

      const tasks = await TaskService.getUserTasks(userId, status as string | undefined);

      res.json({
        tasks,
        count: tasks.length,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Get specific task
router.get(
  '/:id',
  authenticate,
  [param('id').isMongoId()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await TaskService.getTaskById(req.params.id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ task });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Update task
router.put(
  '/:id',
  authenticate,
  [
    param('id').isMongoId(),
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await TaskService.updateTask(req.params.id, req.body);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({
        message: 'Task updated',
        task,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Delete task
router.delete(
  '/:id',
  authenticate,
  [param('id').isMongoId()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deleted = await TaskService.deleteTask(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Complete task
router.post(
  '/:id/complete',
  authenticate,
  [param('id').isMongoId()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await TaskService.completeTask(req.params.id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({
        message: 'Task completed',
        task,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Get upcoming tasks
router.get(
  '/upcoming/:days',
  authenticate,
  [param('days').isInt({ min: 1 })],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user?.id || '';
      const days = parseInt(req.params.days);

      const tasks = await TaskService.getUpcomingTasks(userId, days);

      res.json({
        tasks,
        count: tasks.length,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Get overdue tasks
router.get(
  '/overdue',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id || '';
      const tasks = await TaskService.getOverdueTasks(userId);

      res.json({
        tasks,
        count: tasks.length,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

export default router;
