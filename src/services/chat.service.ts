import { Conversation, IConversation } from '../models/Conversation';
import { groqService, GroqMessage } from './groq.service';

export class ChatService {
  static async createConversation(
    userId: string,
    title?: string
  ): Promise<IConversation> {
    const conversation = new Conversation({
      userId,
      title: title || 'New Conversation',
      messages: [],
    });

    return await conversation.save();
  }

  static async getConversationHistory(conversationId: string): Promise<IConversation | null> {
    return await Conversation.findById(conversationId);
  }

  static async getUserConversations(userId: string): Promise<IConversation[]> {
    return await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(50);
  }

  static async addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<IConversation | null> {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          messages: {
            role,
            content,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  static async deleteConversation(conversationId: string): Promise<boolean> {
    const result = await Conversation.findByIdAndDelete(conversationId);
    return result !== null;
  }

  static async clearConversationHistory(conversationId: string): Promise<IConversation | null> {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { messages: [] },
      { new: true }
    );
  }

  // Generate intelligent response using Groq AI
  static async generateAIResponse(
    userMessage: string,
    conversationHistory: IConversation
  ): Promise<string> {
    // Convert stored messages to Groq format
    const groqMessages: GroqMessage[] = conversationHistory.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      const { response } = await groqService.processUserMessage(userMessage, groqMessages);
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.generateFallbackResponse(userMessage);
    }
  }

  // Extract intent from user message
  static extractIntent(message: string): string {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('task') || lowerMsg.includes('todo')) {
      return 'create_task';
    }
    if (lowerMsg.includes('remind') || lowerMsg.includes('schedule')) {
      return 'schedule_task';
    }
    if (lowerMsg.includes('list') || lowerMsg.includes('show')) {
      return 'list_items';
    }
    if (lowerMsg.includes('search') || lowerMsg.includes('find')) {
      return 'search';
    }
    if (lowerMsg.includes('help') || lowerMsg.includes('what')) {
      return 'help';
    }

    return 'general_chat';
  }

  // Fallback response when AI service is unavailable
  private static generateFallbackResponse(userMessage: string): string {
    const intent = this.extractIntent(userMessage);

    const responses: Record<string, string> = {
      create_task:
        'I can help you create a task. Please tell me what you would like to do?',
      schedule_task:
        'I can schedule a task for you. When would you like to be reminded?',
      list_items: 'Here are your items. Which one would you like to view?',
      search: 'I can search for that. What are you looking for?',
      help: 'I can help with tasks, reminders, knowledge management, and more. What do you need?',
      general_chat: `I understood you said: "${userMessage}". How can I assist you further?`,
    };

    return responses[intent] || responses.general_chat;
  }
}
