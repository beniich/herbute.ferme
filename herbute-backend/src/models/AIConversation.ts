import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  name?: string;
  tool_call_id?: string;
}

export interface IAIConversation extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IChatMessage[];
  aiModel: string;
  contextType?: string;
  isPinned: boolean;
  tokensUsed: number;
  lastMessageAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ['user', 'assistant', 'system', 'tool'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    name: { type: String },
    tool_call_id: { type: String },
  },
  { _id: false }
);

const aiConversationSchema = new Schema<IAIConversation>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    messages: [chatMessageSchema],
    aiModel: { type: String, default: 'llama3.1' },
    contextType: { type: String },
    isPinned: { type: Boolean, default: false },
    tokensUsed: { type: Number, default: 0 },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

aiConversationSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model<IAIConversation>('AIConversation', aiConversationSchema);
