# 🚀 Jarvis AI Assistant API - Quick Start Guide

## ⚡ 5 منٹ میں شروع کریں!

### 1️⃣ Prerequisites (ضروری چیزیں)
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB (یا Docker)
- Groq API Key (حاصل کریں: https://console.groq.com)

---

## 🔧 Windows صارفین کے لیے

### سب سے آسان طریقہ:

```bash
# دوہری کلک کریں:
setup.bat
```

یہ تمام سیٹ اپ خود کر دے گی! ✅

---

## 🐧 Linux/Mac صارفین کے لیے

```bash
chmod +x setup.sh
./setup.sh
```

---

## 🚀 اب API شروع کریں

### Option 1: Development Mode (ٹیسٹنگ کے لیے)

```bash
npm run dev
```

Output:
```
╔════════════════════════════════════════════╗
║     🤖 JARVIS AI ASSISTANT API v1.0       ║
║     🚀 Server running on port 3000         ║
║     📡 Ready to accept connections       ║
╚════════════════════════════════════════════╝
```

✅ API live ہو گی: `http://localhost:3000`

---

### Option 2: Docker کے ساتھ (آسان!)

```bash
docker-compose up
```

یہ MongoDB اور Redis بھی شروع کر دے گی!

---

### Option 3: Production Mode

```bash
npm run build
npm start
```

---

## ✅ API کو ٹیسٹ کریں

### Health Check:
```bash
curl http://localhost:3000/api/health
```

Expected Response:
```json
{
  "status": "ok",
  "message": "Jarvis AI Assistant API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📝 .env فائل کو سیٹ اپ کریں

```bash
# .env فائل میں یہ سیٹ کریں:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/jarvis-ai
JWT_SECRET=your-super-secret-key-here
GROQ_API_KEY=your-groq-api-key-here
GROQ_MODEL=mixtral-8x7b-32768
NODE_ENV=development
```

**Groq API Key حاصل کریں:** https://console.groq.com

---

## 🎯 اب یہ کریں

### 1. User Register کریں:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Response میں **token** ملے گی - اسے save کریں!

### 2. Login کریں:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Conversation بنائیں:
```bash
curl -X POST http://localhost:3000/api/chat/conversations \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Chat"}'
```

Response میں `conversationId` ملے گی!

### 4. Message بھیجیں (AI سے جواب ملے گی!):
```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "<CONVERSATION_ID>",
    "message": "Create a task to buy groceries tomorrow"
  }'
```

AI Groq سے intelligent جواب دے گی! 🤖

### 5. Task بنائیں:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "priority": "high",
    "dueDate": "2024-01-20T18:00:00Z",
    "tags": ["shopping"]
  }'
```

---

## 📚 مکمل API Documentation

تمام 25+ endpoints کے لیے دیکھیں:
- [`COMPLETE_API_DOCS.md`](./COMPLETE_API_DOCS.md)
- [`API_README.md`](./API_README.md)

---

## 🐛 اگر کوئی مسئلہ ہو؟

### MongoDB نہیں چل رہا:
```bash
# Docker استعمال کریں:
docker-compose up
```

### Port 3000 پہلے سے استعمال ہو رہا ہے:
```bash
# .env میں تبدیل کریں:
PORT=3001
```

### npm install fail ہو رہا ہے:
```bash
npm cache clean --force
npm install
```

---

## 🎉 Congratulations!

آپ کے پاس اب **production-ready AI Assistant API** ہے!

### آپ اب کر سکتے ہیں:
- ✅ Task management
- ✅ AI-powered conversations
- ✅ Knowledge base
- ✅ Smart suggestions
- ✅ Productivity analytics
- ✅ 25+ API endpoints

---

## 📞 Need Help?

- Check: `COMPLETE_API_DOCS.md`
- Check: `API_README.md`
- Check: Project structure in `src/`

---

**Happy coding! 🚀**
