import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { SuggestionsService } from '../services/suggestions.service';

const router = Router();

// Get smart suggestions
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const suggestions = await SuggestionsService.getSmartSuggestions(userId);

    res.json({
      suggestions,
      count: suggestions.length,
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
    });
  }
});

// Get productivity insights
router.get(
  '/insights',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id || '';
      const insights = await SuggestionsService.getProductivityInsights(userId);

      res.json({
        insights,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Get recommendations
router.get(
  '/recommendations/:intent',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { intent } = req.params;
      const recommendations = SuggestionsService.generateRecommendations(intent);

      res.json({
        recommendations,
        count: recommendations.length,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

export default router;
