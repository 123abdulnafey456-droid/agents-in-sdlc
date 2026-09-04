# 🤖 JARVIS AI ASSISTANT API

A production-ready intelligent AI assistant API with natural language processing, task automation, knowledge management, and smart recommendations.

## ✨ Features

- **Natural Language Processing** - Understand user intent and generate intelligent responses
- **Task Management** - Create, schedule, and track tasks with priorities and due dates
- **Knowledge Base** - Store and retrieve contextual information
- **Smart Suggestions** - AI-powered recommendations based on user activity
- **Conversation History** - Maintain full conversation logs
- **User Authentication** - JWT-based secure authentication
- **REST API** - Comprehensive REST API endpoints
- **MongoDB Integration** - Scalable document database
- **Docker Support** - Containerized deployment ready

## 📦 Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: express-validator
- **Testing**: Jest + Supertest
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. Install dependencies
```bash
npm install
```

2. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (if not using Docker)
```bash
mongod
```

4. Run the development server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Using Docker

```bash
docker-compose up
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user info

### Chat & Conversations
- `POST /api/chat/conversations` - Create conversation
- `GET /api/chat/conversations` - List user conversations
- `GET /api/chat/conversations/:id` - Get specific conversation
- `POST /api/chat/message` - Send message
- `DELETE /api/chat/conversations/:id` - Delete conversation
- `POST /api/chat/conversations/:id/clear` - Clear history

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/complete` - Mark task complete
- `GET /api/tasks/upcoming/:days` - Get upcoming tasks
- `GET /api/tasks/overdue` - Get overdue tasks

### Knowledge Base
- `POST /api/knowledge` - Add knowledge
- `GET /api/knowledge` - List all knowledge
- `GET /api/knowledge/:id` - Get knowledge details
- `PUT /api/knowledge/:id` - Update knowledge
- `DELETE /api/knowledge/:id` - Delete knowledge
- `GET /api/knowledge/search/:query` - Search knowledge
- `GET /api/knowledge/category/:category` - Get by category

### Suggestions
- `GET /api/suggestions` - Get smart suggestions
- `GET /api/suggestions/insights` - Get productivity insights
- `GET /api/suggestions/recommendations/:intent` - Get recommendations

### Health Check
- `GET /api/health` - API health status

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Example Usage

### Register and Login

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the API implementation",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59Z",
    "tags": ["work", "urgent"]
  }'
```

### Send a Message

```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "<conversation-id>",
    "message": "Create a task for tomorrow morning"
  }'
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📦 Build & Deployment

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## 📖 Project Structure

```
jarvis-ai-assistant-api/
├── src/
│   ├── index.ts              # Entry point
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── models/               # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Conversation.ts
│   │   ├── Task.ts
│   │   └── KnowledgeBase.ts
│   ├── routes/               # API routes
│   │   ├── auth.routes.ts
│   │   ├── chat.routes.ts
│   │   ├── task.routes.ts
│   │   ├── knowledge.routes.ts
│   │   └── suggestions.routes.ts
│   ├── services/             # Business logic
│   │   ├── auth.service.ts
│   │   ├── chat.service.ts
│   │   ├── task.service.ts
│   │   ├── knowledge.service.ts
│   │   └── suggestions.service.ts
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
├── tests/                    # Test files
├── docker-compose.yml        # Docker compose config
├── Dockerfile               # Docker image config
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── API_README.md            # This file
```

## 🎯 Roadmap

- [ ] Integration with OpenAI API for advanced NLP
- [ ] WebSocket support for real-time conversations
- [ ] Advanced analytics and reporting
- [ ] Plugin system for extensibility
- [ ] Mobile app integration
- [ ] Voice input/output support
- [ ] Multi-language support
- [ ] Advanced scheduling system

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ by Jarvis Team**
