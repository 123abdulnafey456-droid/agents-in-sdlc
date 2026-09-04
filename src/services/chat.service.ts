import { Conversation, IConversation } from '../models/Conversation';

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

  // Simple NLP: Extract intent from user message
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

  // Generate intelligent response based on intent
  static generateResponse(intent: string, userMessage: string): string {
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
