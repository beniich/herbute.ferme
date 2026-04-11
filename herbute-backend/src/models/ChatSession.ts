import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: any[];
}

export interface IChatSession extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IChatMessage[];
  context?: string; // e.g., 'inventory', 'hr', 'finance'
  isPinned: boolean;
  aiModel: string; // e.g., 'llama3.1', 'gpt-4'
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Nouvelle conversation',
    },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        toolCalls: { type: Schema.Types.Mixed },
      },
    ],
    context: {
      type: String,
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    aiModel: {
      type: String,
      default: 'llama3.1',
    },
  },
  {
    timestamps: true,
  }
);

// Index for getting sessions of a user in an org, sorted by recency
ChatSessionSchema.index({ organizationId: 1, userId: 1, updatedAt: -1 });

export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
