import { Schema, model, Document } from 'mongoose';

export interface IConversation extends Document {
  userId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    title: {
      type: String,
      default: 'New Conversation',
    },
  },
  {
    timestamps: true,
  }
);

export const Conversation = model<IConversation>(
  'Conversation',
  conversationSchema
);
