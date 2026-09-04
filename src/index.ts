import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import taskRoutes from './routes/task.routes';
import knowledgeRoutes from './routes/knowledge.routes';
import suggestionsRoutes from './routes/suggestions.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jarvis-ai';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Database Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err: Error) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Jarvis AI Assistant API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/suggestions', suggestionsRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║     🤖 JARVIS AI ASSISTANT API v1.0       ║
║     🚀 Server running on port ${PORT}         ║
║     📡 Ready to accept connections       ║
╚════════════════════════════════════════════╝
  `);
});

export default app;
