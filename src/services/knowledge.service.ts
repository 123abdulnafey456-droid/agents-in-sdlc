import { KnowledgeBase, IKnowledgeBase } from '../models/KnowledgeBase';

export class KnowledgeService {
  static async addKnowledge(
    userId: string,
    title: string,
    content: string,
    category: string = 'general',
    tags: string[] = [],
    metadata: Record<string, any> = {}
  ): Promise<IKnowledgeBase> {
    const knowledge = new KnowledgeBase({
      userId,
      title,
      content,
      category,
      tags,
      metadata,
    });

    return await knowledge.save();
  }

  static async getKnowledgeById(id: string): Promise<IKnowledgeBase | null> {
    return await KnowledgeBase.findById(id);
  }

  static async getUserKnowledge(userId: string): Promise<IKnowledgeBase[]> {
    return await KnowledgeBase.find({ userId }).sort({ createdAt: -1 });
  }

  static async searchKnowledge(
    userId: string,
    query: string
  ): Promise<IKnowledgeBase[]> {
    return await KnowledgeBase.find({
      userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [query] } },
      ],
    });
  }

  static async getByCategory(
    userId: string,
    category: string
  ): Promise<IKnowledgeBase[]> {
    return await KnowledgeBase.find({ userId, category }).sort({ createdAt: -1 });
  }

  static async updateKnowledge(
    id: string,
    updates: Partial<IKnowledgeBase>
  ): Promise<IKnowledgeBase | null> {
    return await KnowledgeBase.findByIdAndUpdate(id, updates, { new: true });
  }

  static async deleteKnowledge(id: string): Promise<boolean> {
    const result = await KnowledgeBase.findByIdAndDelete(id);
    return result !== null;
  }

  static async getCategories(userId: string): Promise<string[]> {
    const docs = await KnowledgeBase.find({ userId }).distinct('category');
    return docs;
  }
}
