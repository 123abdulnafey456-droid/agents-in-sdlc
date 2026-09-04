import { Task } from '../models/Task';
import { Conversation } from '../models/Conversation';

export interface Suggestion {
  type: string;
  title: string;
  description: string;
  priority: string;
}

export class SuggestionsService {
  static async getSmartSuggestions(userId: string): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = [];

    try {
      // Get overdue tasks
      const overdueTasks = await Task.countDocuments({
        userId,
        status: { $ne: 'completed' },
        dueDate: { $lt: new Date() },
      });

      if (overdueTasks > 0) {
        suggestions.push({
          type: 'overdue_alert',
          title: `You have ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}`,
          description: 'Complete overdue tasks to maintain productivity',
          priority: 'high',
        });
      }

      // Get tasks due today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dueTodayCount = await Task.countDocuments({
        userId,
        status: { $ne: 'completed' },
        dueDate: {
          $gte: today,
          $lt: tomorrow,
        },
      });

      if (dueTodayCount > 0) {
        suggestions.push({
          type: 'task_reminder',
          title: `${dueTodayCount} task${dueTodayCount > 1 ? 's' : ''} due today`,
          description: 'Focus on completing today\'s tasks',
          priority: 'medium',
        });
      }

      // Get pending tasks
      const pendingCount = await Task.countDocuments({
        userId,
        status: 'pending',
      });

      if (pendingCount > 5) {
        suggestions.push({
          type: 'task_backlog',
          title: `You have ${pendingCount} pending tasks`,
          description: 'Consider prioritizing or completing some tasks',
          priority: 'medium',
        });
      }

      // Get conversation stats
      const conversationCount = await Conversation.countDocuments({
        userId,
      });

      if (conversationCount === 0) {
        suggestions.push({
          type: 'welcome',
          title: 'Start your first conversation',
          description: 'Ask me anything - create tasks, search for knowledge, or just chat',
          priority: 'low',
        });
      }

      // Suggest organizing knowledge
      suggestions.push({
        type: 'knowledge_tip',
        title: 'Organize your knowledge',
        description: 'Add notes and information to your knowledge base for quick access',
        priority: 'low',
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }

    return suggestions;
  }

  static async getProductivityInsights(userId: string): Promise<Record<string, any>> {
    try {
      const completedTasks = await Task.countDocuments({
        userId,
        status: 'completed',
      });

      const pendingTasks = await Task.countDocuments({
        userId,
        status: { $in: ['pending', 'in_progress'] },
      });

      const conversations = await Conversation.countDocuments({
        userId,
      });

      const completionRate =
        completedTasks + pendingTasks > 0
          ? Math.round((completedTasks / (completedTasks + pendingTasks)) * 100)
          : 0;

      return {
        completedTasks,
        pendingTasks,
        conversations,
        completionRate: `${completionRate}%`,
        streak: Math.floor(Math.random() * 10) + 1, // Placeholder
      };
    } catch (error) {
      console.error('Error getting productivity insights:', error);
      return {};
    }
  }

  static generateRecommendations(intent: string): Suggestion[] {
    const recommendations: Record<string, Suggestion[]> = {
      productivity: [
        {
          type: 'tip',
          title: 'Break down large tasks',
          description: 'Divide big tasks into smaller, manageable sub-tasks',
          priority: 'medium',
        },
        {
          type: 'tip',
          title: 'Use priorities wisely',
          description: 'Mark tasks as high priority only when truly urgent',
          priority: 'low',
        },
      ],
      time_management: [
        {
          type: 'tip',
          title: 'Set realistic deadlines',
          description: 'Avoid setting too many tasks for a single day',
          priority: 'medium',
        },
        {
          type: 'tip',
          title: 'Review your schedule',
          description: 'Check upcoming tasks at the start of each day',
          priority: 'low',
        },
      ],
      learning: [
        {
          type: 'tip',
          title: 'Document learnings',
          description: 'Save important information to your knowledge base',
          priority: 'medium',
        },
        {
          type: 'tip',
          title: 'Review past notes',
          description: 'Regularly review stored knowledge for retention',
          priority: 'low',
        },
      ],
    };

    return recommendations[intent] || [];
  }
}
