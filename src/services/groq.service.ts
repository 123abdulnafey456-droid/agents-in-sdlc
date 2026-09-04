import axios from 'axios';

export interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class GroqService {
  private apiKey: string;
  private model: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    this.model = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    if (!this.apiKey) {
      console.warn('⚠️  GROQ_API_KEY not configured. NLP features will use basic fallback responses.');
    }
  }

  async generateResponse(
    messages: GroqMessage[],
    maxTokens: number = 500
  ): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackResponse(messages);
    }

    try {
      const response = await axios.post<GroqResponse>(
        this.apiUrl,
        {
          model: this.model,
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return (
        response.data.choices[0]?.message?.content ||
        'I could not generate a response at this time.'
      );
    } catch (error) {
      console.error('Groq API error:', error);
      return this.getFallbackResponse(messages);
    }
  }

  async processUserMessage(
    userMessage: string,
    conversationHistory: GroqMessage[] = []
  ): Promise<{ response: string; intent: string }> {
    const systemPrompt: GroqMessage = {
      role: 'system',
      content: `You are Jarvis, an intelligent AI assistant. You help users with:
- Managing tasks and to-do lists
- Scheduling and reminders
- Storing and retrieving knowledge
- Providing productivity insights
- Answering questions and providing assistance

Be concise, helpful, and professional. When users mention creating tasks, extracting important information.`,
    };

    const messages: GroqMessage[] = [
      systemPrompt,
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const intent = this.extractIntent(userMessage);
    const response = await this.generateResponse(messages);

    return { response, intent };
  }

  private extractIntent(message: string): string {
    const lowerMsg = message.toLowerCase();

    const intentMap: Record<string, string[]> = {
      create_task: ['create', 'add', 'new task', 'todo', 'task'],
      schedule: ['schedule', 'remind', 'remind me', 'set reminder', 'calendar'],
      search: ['search', 'find', 'look for', 'find me'],
      list: ['list', 'show', 'what are', 'get all'],
      complete: ['done', 'complete', 'finished', 'mark as done'],
      help: ['help', 'how to', 'what can you do', 'capabilities'],
      analytics: ['analytics', 'insights', 'stats', 'productivity'],
      knowledge: ['know', 'remember', 'save', 'store'],
    };

    for (const [intent, keywords] of Object.entries(intentMap)) {
      if (keywords.some((keyword) => lowerMsg.includes(keyword))) {
        return intent;
      }
    }

    return 'general_chat';
  }

  private getFallbackResponse(messages: GroqMessage[]): string {
    const lastMessage = messages[messages.length - 1]?.content || '';

    const fallbackResponses: Record<string, string> = {
      create_task:
        'I can help you create a task. Please provide the task title and any due date.',
      schedule:
        'I can schedule a reminder for you. When would you like to be reminded?',
      search:
        'I can help you search. What would you like me to search for?',
      list: 'Here are the items. Which one would you like to see more details about?',
      complete: 'Great! I\'ve marked that as complete.',
      help: 'I can help with tasks, reminders, knowledge storage, analytics, and more. What do you need?',
      analytics:
        'Based on your activity, here are your productivity insights.',
      knowledge: 'I\'ve saved that information to your knowledge base.',
      general_chat: `You said: "${lastMessage}". How can I assist you further?`,
    };

    const intent = this.extractIntent(lastMessage);
    return fallbackResponses[intent] || fallbackResponses.general_chat;
  }

  async summarizeText(text: string): Promise<string> {
    if (!this.apiKey) {
      return text.substring(0, 100) + '...';
    }

    const messages: GroqMessage[] = [
      {
        role: 'system',
        content:
          'Summarize the following text in 2-3 sentences. Be concise and capture the main points.',
      },
      {
        role: 'user',
        content: text,
      },
    ];

    return this.generateResponse(messages, 200);
  }

  async extractKeywords(text: string): Promise<string[]> {
    if (!this.apiKey) {
      return text.split(' ').slice(0, 5);
    }

    const messages: GroqMessage[] = [
      {
        role: 'system',
        content:
          'Extract 5 key keywords from the text. Return only the keywords separated by commas.',
      },
      {
        role: 'user',
        content: text,
      },
    ];

    const response = await this.generateResponse(messages, 100);
    return response.split(',').map((k) => k.trim());
  }
}

export const groqService = new GroqService();
