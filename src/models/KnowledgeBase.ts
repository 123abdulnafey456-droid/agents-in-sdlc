import { Schema, model, Document } from 'mongoose';

export interface IKnowledgeBase extends Document {
  userId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const knowledgeSchema = new Schema<IKnowledgeBase>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'general',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient searches
knowledgeSchema.index({ userId: 1, category: 1 });
knowledgeSchema.index({ userId: 1, tags: 1 });

export const KnowledgeBase = model<IKnowledgeBase>(
  'KnowledgeBase',
  knowledgeSchema
);
