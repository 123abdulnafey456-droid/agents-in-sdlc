import { Router, Response } from 'express';
import { body, validationResult, param } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { ChatService } from '../services/chat.service';

const router = Router();

// Create new conversation
router.post(
  '/conversations',
  authenticate,
  [body('title').optional().trim()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title } = req.body;
      const userId = req.user?.id || '';

      const conversation = await ChatService.createConversation(userId, title);

      res.status(201).json({
        message: 'Conversation created',
        conversation,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Get all conversations for user
router.get('/conversations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const conversations = await ChatService.getUserConversations(userId);

    res.json({
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
    });
  }
});

// Get specific conversation
router.get(
  '/conversations/:id',
  authenticate,
  [param('id').isMongoId()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const conversation = await ChatService.getConversationHistory(req.params.id);

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      res.json({
        conversation,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Send message
router.post(
  '/message',
  authenticate,
  [
    body('conversationId').isMongoId(),
    body('message').trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { conversationId, message } = req.body;

      // Add user message
      await ChatService.addMessage(conversationId, 'user', message);

      // Get conversation history for context
      const conversation = await ChatService.getConversationHistory(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      // Extract intent
      const intent = ChatService.extractIntent(message);

      // Generate AI-powered response
      const assistantResponse = await ChatService.generateAIResponse(message, conversation);

      // Add assistant response
      const updatedConversation = await ChatService.addMessage(
        conversationId,
        'assistant',
        assistantResponse
      );

      res.json({
        message: 'Message processed successfully',
        conversation: updatedConversation,
        intent,
        response: assistantResponse,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Delete conversation
router.delete(
  '/conversations/:id',
  authenticate,
  [param('id').isMongoId()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const deleted = await ChatService.deleteConversation(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      res.json({
        message: 'Conversation deleted',
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

// Clear conversation history
router.post(
  '/conversations/:id/clear',
  authenticate,
  [param('id').isMongoId()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const conversation = await ChatService.clearConversationHistory(req.params.id);

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      res.json({
        message: 'Conversation history cleared',
        conversation,
      });
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
      });
    }
  }
);

export default router;
