import { Task, ITask } from '../models/Task';

export class TaskService {
  static async createTask(
    userId: string,
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    dueDate?: Date,
    tags: string[] = []
  ): Promise<ITask> {
    const task = new Task({
      userId,
      title,
      description,
      priority,
      dueDate,
      tags,
    });

    return await task.save();
  }

  static async getUserTasks(userId: string, status?: string): Promise<ITask[]> {
    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    return await Task.find(query).sort({ dueDate: 1, priority: -1 });
  }

  static async getTaskById(taskId: string): Promise<ITask | null> {
    return await Task.findById(taskId);
  }

  static async updateTask(
    taskId: string,
    updates: Partial<ITask>
  ): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(taskId, updates, { new: true });
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    const result = await Task.findByIdAndDelete(taskId);
    return result !== null;
  }

  static async scheduleTask(
    taskId: string,
    scheduledFor: Date
  ): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(
      taskId,
      { scheduledFor },
      { new: true }
    );
  }

  static async completeTask(taskId: string): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(
      taskId,
      { status: 'completed' },
      { new: true }
    );
  }

  static async getUpcomingTasks(userId: string, days: number = 7): Promise<ITask[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return await Task.find({
      userId,
      dueDate: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $ne: 'completed' },
    }).sort({ dueDate: 1 });
  }

  static async getOverdueTasks(userId: string): Promise<ITask[]> {
    return await Task.find({
      userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' },
    }).sort({ dueDate: 1 });
  }
}
