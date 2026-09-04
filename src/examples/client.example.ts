import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class JarvisClient {
  private token: string = '';

  /**
   * Register a new user
   */
  async register(email: string, password: string, firstName: string, lastName: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        firstName,
        lastName,
      });

      this.token = response.data.token;
      console.log('✅ User registered:', response.data.user);
      console.log('🔐 Token saved');
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      this.token = response.data.token;
      console.log('✅ Login successful');
      console.log('🔐 Token saved');
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  async getMe() {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      console.log('✅ Current user:', response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('❌ Failed to get user:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(title: string = 'New Conversation') {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/conversations`,
        { title },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      console.log('✅ Conversation created:', response.data.conversation._id);
      return response.data.conversation;
    } catch (error) {
      console.error('❌ Failed to create conversation:', error);
      throw error;
    }
  }

  /**
   * Send message to conversation (gets AI response)
   */
  async sendMessage(conversationId: string, message: string) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/message`,
        { conversationId, message },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      console.log('📤 User:', message);
      console.log('🤖 Jarvis:', response.data.response);
      console.log('🎯 Intent:', response.data.intent);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Create a task
   */
  async createTask(
    title: string,
    description: string = '',
    priority: 'low' | 'medium' | 'high' = 'medium',
    dueDate?: string,
    tags: string[] = []
  ) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tasks`,
        { title, description, priority, dueDate, tags },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      console.log('✅ Task created:', response.data.task._id);
      console.log('   Title:', response.data.task.title);
      console.log('   Priority:', response.data.task.priority);
      return response.data.task;
    } catch (error) {
      console.error('❌ Failed to create task:', error);
      throw error;
    }
  }

  /**
   * Get all tasks
   */
  async getTasks(status?: string) {
    try {
      const url = status
        ? `${API_BASE_URL}/tasks?status=${status}`
        : `${API_BASE_URL}/tasks`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      console.log(`✅ Tasks (${response.data.count}):`, response.data.tasks);
      return response.data.tasks;
    } catch (error) {
      console.error('❌ Failed to get tasks:', error);
      throw error;
    }
  }

  /**
   * Get smart suggestions
   */
  async getSuggestions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/suggestions`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      console.log('💡 Suggestions:');
      response.data.suggestions.forEach((s: any) => {
        console.log(`   • [${s.priority}] ${s.title}`);
        console.log(`     ${s.description}`);
      });
      return response.data.suggestions;
    } catch (error) {
      console.error('❌ Failed to get suggestions:', error);
      throw error;
    }
  }

  /**
   * Get productivity insights
   */
  async getInsights() {
    try {
      const response = await axios.get(`${API_BASE_URL}/suggestions/insights`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      console.log('📊 Productivity Insights:');
      console.log('   Completed tasks:', response.data.insights.completedTasks);
      console.log('   Pending tasks:', response.data.insights.pendingTasks);
      console.log('   Conversations:', response.data.insights.conversations);
      console.log('   Completion rate:', response.data.insights.completionRate);
      return response.data.insights;
    } catch (error) {
      console.error('❌ Failed to get insights:', error);
      throw error;
    }
  }

  /**
   * Add knowledge
   */
  async addKnowledge(
    title: string,
    content: string,
    category: string = 'general',
    tags: string[] = []
  ) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/knowledge`,
        { title, content, category, tags },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      console.log('✅ Knowledge added:', response.data.knowledge._id);
      return response.data.knowledge;
    } catch (error) {
      console.error('❌ Failed to add knowledge:', error);
      throw error;
    }
  }

  /**
   * Search knowledge
   */
  async searchKnowledge(query: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/knowledge/search/${query}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      console.log(`✅ Search results for "${query}" (${response.data.count}):`, response.data.results);
      return response.data.results;
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw error;
    }
  }

  /**
   * Get health status
   */
  static async getHealth() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      console.log('✅ API is healthy:', response.data.message);
      return response.data;
    } catch (error) {
      console.error('❌ API is down:', error);
      throw error;
    }
  }
}

export default JarvisClient;
