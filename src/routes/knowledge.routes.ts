import { Router, Response } from 'express';
import { body, validationResult, param, query } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { KnowledgeService } from '../services/knowledge.service';

const router = Router();

// Add knowledge
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('category').optional().trim(),
    body('tags').optional().isArray(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content, category, tags, metadata } = req.body;
      const userId = req.user?.id || '';

      const knowledge = await KnowledgeService.addKnowledge(
        userId,
        title,
        content,
        category || 'general',
        tags || [],
        metadata || {}
      );

      res.status(201).json({
        message: 'Knowledge added',
        knowledge,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Get all knowledge
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const knowledge = await KnowledgeService.getUserKnowledge(userId);

    res.json({
      knowledge,
      count: knowledge.length,
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
    });
  }
});

// Search knowledge
router.get(
  '/search/:query',
  authenticate,
  [param('query').trim().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user?.id || '';
      const { query: searchQuery } = req.params;

      const results = await KnowledgeService.searchKnowledge(userId, searchQuery);

      res.json({
        results,
        count: results.length,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Get by category
router.get(
  '/category/:category',
  authenticate,
  [param('category').trim().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user?.id || '';
      const { category } = req.params;

      const knowledge = await KnowledgeService.getByCategory(userId, category);

      res.json({
        knowledge,
        count: knowledge.length,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Get specific knowledge
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

      const knowledge = await KnowledgeService.getKnowledgeById(req.params.id);

      if (!knowledge) {
        return res.status(404).json({ error: 'Knowledge not found' });
      }

      res.json({ knowledge });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Update knowledge
router.put(
  '/:id',
  authenticate,
  [
    param('id').isMongoId(),
    body('title').optional().trim(),
    body('content').optional().trim(),
    body('category').optional().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const knowledge = await KnowledgeService.updateKnowledge(
        req.params.id,
        req.body
      );

      if (!knowledge) {
        return res.status(404).json({ error: 'Knowledge not found' });
      }

      res.json({
        message: 'Knowledge updated',
        knowledge,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Delete knowledge
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

      const deleted = await KnowledgeService.deleteKnowledge(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Knowledge not found' });
      }

      res.json({ message: 'Knowledge deleted' });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Get categories
router.get(
  '/list/categories',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id || '';
      const categories = await KnowledgeService.getCategories(userId);

      res.json({
        categories,
        count: categories.length,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

export default router;
