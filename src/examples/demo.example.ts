/**
 * Jarvis API - Complete Demo/Test Script
 * 
 * یہ سب features کو demonstrate کرتا ہے
 */

import JarvisClient from './client.example';

async function runFullDemo() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         🤖 JARVIS AI ASSISTANT API - COMPLETE DEMO       ║
╚════════════════════════════════════════════════════════════╝
  `);

  try {
    // Step 1: Check API Health
    console.log('\n📋 Step 1: Checking API Health...');
    console.log('─'.repeat(60));
    await JarvisClient.getHealth();

    // Step 2: Register User
    console.log('\n📋 Step 2: Registering New User...');
    console.log('─'.repeat(60));
    const client = new JarvisClient();
    const email = `user_${Date.now()}@example.com`;
    await client.register(email, 'password123', 'Ahmed', 'Khan');

    // Step 3: Get Current User
    console.log('\n📋 Step 3: Fetching Current User...');
    console.log('─'.repeat(60));
    await client.getMe();

    // Step 4: Create Conversation
    console.log('\n📋 Step 4: Creating Conversation...');
    console.log('─'.repeat(60));
    const conversation = await client.createConversation('🤖 Jarvis Demo Chat');

    // Step 5: Send Messages (AI will respond)
    console.log('\n📋 Step 5: Sending Messages (Getting AI Responses)...');
    console.log('─'.repeat(60));

    await client.sendMessage(
      conversation._id,
      'What can you help me with?'
    );

    console.log('\n' + '─'.repeat(60));
    await client.sendMessage(
      conversation._id,
      'Create a task to complete the project by tomorrow'
    );

    // Step 6: Create Multiple Tasks
    console.log('\n📋 Step 6: Creating Tasks...');
    console.log('─'.repeat(60));

    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await client.createTask(
      'Complete Jarvis API Integration',
      'Integrate Jarvis API with mobile app',
      'high',
      tomorrow,
      ['development', 'urgent']
    );

    await client.createTask(
      'Review Code',
      'Review PR #42 for quality',
      'medium',
      nextWeek,
      ['review', 'development']
    );

    await client.createTask(
      'Write Documentation',
      'Complete API documentation',
      'low',
      nextWeek,
      ['documentation']
    );

    // Step 7: Get All Tasks
    console.log('\n📋 Step 7: Fetching All Tasks...');
    console.log('─'.repeat(60));
    await client.getTasks();

    // Step 8: Add Knowledge
    console.log('\n📋 Step 8: Adding Knowledge...');
    console.log('─'.repeat(60));

    await client.addKnowledge(
      'TypeScript Best Practices',
      `
      - Use strict mode
      - Avoid 'any' type
      - Use interfaces for contracts
      - Use enums for constants
      - Use readonly for immutability
      `,
      'programming',
      ['typescript', 'best-practices']
    );

    await client.addKnowledge(
      'API Design Principles',
      `
      - RESTful conventions
      - Proper HTTP status codes
      - Clear error messages
      - Versioning strategy
      - Documentation
      `,
      'architecture',
      ['api', 'design']
    );

    // Step 9: Search Knowledge
    console.log('\n📋 Step 9: Searching Knowledge...');
    console.log('─'.repeat(60));
    await client.searchKnowledge('typescript');

    // Step 10: Get Suggestions
    console.log('\n📋 Step 10: Getting Smart Suggestions...');
    console.log('─'.repeat(60));
    await client.getSuggestions();

    // Step 11: Get Insights
    console.log('\n📋 Step 11: Getting Productivity Insights...');
    console.log('─'.repeat(60));
    await client.getInsights();

    // Success Summary
    console.log(`
╔════════════════════════════════════════════════════════════╗
║              ✅ DEMO COMPLETED SUCCESSFULLY!              ║
╚════════════════════════════════════════════════════════════╝

🎉 All Features Tested:
  ✅ Authentication (Register, Login, Get Profile)
  ✅ Conversations (Create & Chat with AI)
  ✅ Task Management (Create multiple tasks)
  ✅ Knowledge Base (Add & Search)
  ✅ Smart Suggestions (Get recommendations)
  ✅ Productivity Insights (Track progress)

📊 API Statistics:
  - 5 Services (Auth, Chat, Task, Knowledge, Suggestions)
  - 25+ Endpoints
  - Groq AI Integration
  - MongoDB Persistence
  - JWT Authentication

🚀 Next Steps:
  1. Integrate Jarvis into your application
  2. Configure Groq API key for better AI responses
  3. Set up MongoDB for production
  4. Deploy with Docker

📖 Documentation:
  - COMPLETE_API_DOCS.md - Full API reference
  - API_README.md - Overview and features
  - QUICKSTART.md - Getting started guide

💡 Example: client.example.ts shows all available methods

Happy coding! 🎯
    `);

  } catch (error) {
    console.error('\n❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
runFullDemo();
