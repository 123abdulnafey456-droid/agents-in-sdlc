# Jarvis AI Assistant API - Complete Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Error Handling](#error-handling)
5. [Examples](#examples)
6. [Deployment](#deployment)

## Getting Started

### Requirements
- Node.js 18+
- MongoDB
- Groq API key (optional, for advanced NLP)
- npm or yarn

### Installation

```bash
# Clone and install
git clone <repository>
cd jarvis-ai-assistant-api
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

### Docker Setup

```bash
docker-compose up
```

The API will be available at `http://localhost:3000`

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### How to Get a Token

1. **Register a new user**
   ```bash
   POST /api/auth/register
   ```

2. **Login**
   ```bash
   POST /api/auth/login
   ```

3. Both endpoints return a token that you can use for subsequent requests.

---

## API Endpoints

### 🔐 Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {...}
}
```

#### Refresh Token
```
POST /api/auth/refresh
Authorization: Bearer <old-token>

Response: 200 OK
{
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

---

### 💬 Chat & Conversations

#### Create Conversation
```
POST /api/chat/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Conversation"
}

Response: 201 Created
{
  "message": "Conversation created",
  "conversation": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "title": "My First Conversation",
    "messages": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get All Conversations
```
GET /api/chat/conversations
Authorization: Bearer <token>

Response: 200 OK
{
  "conversations": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My First Conversation",
      "messages": [...],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Send Message (with AI Response)
```
POST /api/chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "507f1f77bcf86cd799439011",
  "message": "Create a task for tomorrow"
}

Response: 200 OK
{
  "message": "Message processed successfully",
  "intent": "create_task",
  "response": "I can help you create a task. What should the task be about?",
  "conversation": {
    "_id": "507f1f77bcf86cd799439011",
    "messages": [
      {
        "role": "user",
        "content": "Create a task for tomorrow",
        "timestamp": "2024-01-15T10:31:00Z"
      },
      {
        "role": "assistant",
        "content": "I can help you create a task. What should the task be about?",
        "timestamp": "2024-01-15T10:31:01Z"
      }
    ]
  }
}
```

#### Clear Conversation History
```
POST /api/chat/conversations/{conversationId}/clear
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Conversation history cleared",
  "conversation": {...}
}
```

#### Delete Conversation
```
DELETE /api/chat/conversations/{conversationId}
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Conversation deleted"
}
```

---

### ✅ Tasks

#### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the Jarvis API implementation",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59Z",
  "tags": ["work", "urgent"]
}

Response: 201 Created
{
  "message": "Task created",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "title": "Complete project",
    "description": "Finish the Jarvis API implementation",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59Z",
    "tags": ["work", "urgent"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get All Tasks
```
GET /api/tasks?status=pending
Authorization: Bearer <token>

Response: 200 OK
{
  "tasks": [...],
  "count": 5
}
```

#### Get Task Details
```
GET /api/tasks/{taskId}
Authorization: Bearer <token>

Response: 200 OK
{
  "task": {...}
}
```

#### Update Task
```
PUT /api/tasks/{taskId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "medium"
}

Response: 200 OK
{
  "message": "Task updated",
  "task": {...}
}
```

#### Complete Task
```
POST /api/tasks/{taskId}/complete
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Task completed",
  "task": {
    ...
    "status": "completed"
  }
}
```

#### Get Upcoming Tasks
```
GET /api/tasks/upcoming/7
Authorization: Bearer <token>

Response: 200 OK
{
  "tasks": [...],
  "count": 3
}
```

#### Get Overdue Tasks
```
GET /api/tasks/overdue
Authorization: Bearer <token>

Response: 200 OK
{
  "tasks": [...],
  "count": 2
}
```

#### Delete Task
```
DELETE /api/tasks/{taskId}
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Task deleted"
}
```

---

### 📚 Knowledge Base

#### Add Knowledge
```
POST /api/knowledge
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Python Best Practices",
  "content": "Always follow PEP 8 style guide...",
  "category": "programming",
  "tags": ["python", "best-practices"],
  "metadata": {
    "source": "PEP 8",
    "importance": "high"
  }
}

Response: 201 Created
{
  "message": "Knowledge added",
  "knowledge": {...}
}
```

#### Get All Knowledge
```
GET /api/knowledge
Authorization: Bearer <token>

Response: 200 OK
{
  "knowledge": [...],
  "count": 10
}
```

#### Search Knowledge
```
GET /api/knowledge/search/python
Authorization: Bearer <token>

Response: 200 OK
{
  "results": [...],
  "count": 3
}
```

#### Get by Category
```
GET /api/knowledge/category/programming
Authorization: Bearer <token>

Response: 200 OK
{
  "knowledge": [...],
  "count": 5
}
```

#### Update Knowledge
```
PUT /api/knowledge/{knowledgeId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content..."
}

Response: 200 OK
{
  "message": "Knowledge updated",
  "knowledge": {...}
}
```

#### Delete Knowledge
```
DELETE /api/knowledge/{knowledgeId}
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Knowledge deleted"
}
```

---

### 🧠 Suggestions & Insights

#### Get Smart Suggestions
```
GET /api/suggestions
Authorization: Bearer <token>

Response: 200 OK
{
  "suggestions": [
    {
      "type": "overdue_alert",
      "title": "You have 2 overdue tasks",
      "description": "Complete overdue tasks to maintain productivity",
      "priority": "high"
    },
    {
      "type": "task_reminder",
      "title": "3 tasks due today",
      "description": "Focus on completing today's tasks",
      "priority": "medium"
    }
  ],
  "count": 2
}
```

#### Get Productivity Insights
```
GET /api/suggestions/insights
Authorization: Bearer <token>

Response: 200 OK
{
  "insights": {
    "completedTasks": 15,
    "pendingTasks": 8,
    "conversations": 12,
    "completionRate": "65%",
    "streak": 7
  }
}
```

#### Get Recommendations
```
GET /api/suggestions/recommendations/productivity
Authorization: Bearer <token>

Response: 200 OK
{
  "recommendations": [
    {
      "type": "tip",
      "title": "Break down large tasks",
      "description": "Divide big tasks into smaller, manageable sub-tasks",
      "priority": "medium"
    }
  ],
  "count": 1
}
```

---

### 🏥 Health Check

#### API Status
```
GET /api/health

Response: 200 OK
{
  "status": "ok",
  "message": "Jarvis AI Assistant API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "error": {
    "status": 400,
    "message": "Error description",
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/endpoint"
  }
}
```

### Common Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

### Validation Errors

```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## Examples

### Complete Workflow Example

```bash
# 1. Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
# Save the returned token

# 2. Create conversation
curl -X POST http://localhost:3000/api/chat/conversations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Chat"}'
# Save the returned conversationId

# 3. Send message
curl -X POST http://localhost:3000/api/chat/message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "<conversationId>",
    "message": "Create a task to buy groceries"
  }'

# 4. Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "priority": "medium",
    "dueDate": "2024-01-20T18:00:00Z"
  }'

# 5. Get suggestions
curl -X GET http://localhost:3000/api/suggestions \
  -H "Authorization: Bearer <token>"
```

---

## Deployment

### Environment Variables

```
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jarvis
JWT_SECRET=your-super-secret-key
GROQ_API_KEY=your-groq-api-key
NODE_ENV=production
```

### Docker Deployment

```bash
docker build -t jarvis-api .
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongo:27017/jarvis \
  -e JWT_SECRET=your-secret \
  jarvis-api
```

### Production Checklist

- [ ] Update `JWT_SECRET` with a strong random key
- [ ] Configure `MONGODB_URI` with production database
- [ ] Set `NODE_ENV=production`
- [ ] Add `GROQ_API_KEY` for AI features
- [ ] Set up SSL/TLS certificates
- [ ] Enable CORS for your domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all endpoints thoroughly

---

## Support & Resources

- **Documentation**: See API_README.md
- **Issues**: Open an issue on GitHub
- **Contributing**: See CONTRIBUTING.md

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15
