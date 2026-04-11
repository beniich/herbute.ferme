import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  ownerId: mongoose.Types.ObjectId;
  logo?: string;
  settings: {
    theme?: string;
    locale?: string;
    currency?: string;
    timezone?: string;
    exportStorage?: 'local' | 'google_drive';
    googleDriveFolderId?: string;
    googleDriveRefreshToken?: string;
  };
  subscription: {
    plan: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
    status: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELED' | 'SUSPENDED';
    stripeCustomerId?: string;
    expiresAt?: Date;
    quotas: {
      maxUsers: number;
      maxStorage: number; // En Mo
      aiRequestsPerDay: number;
      maxAnimals?: number;
      maxCrops?: number;
    };
  };
  billing: {
    lastBillingDate?: Date;
    nextBillingDate?: Date;
    paymentMethodLinked: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
      maxlength: 50,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    logo: {
      type: String,
      default: null,
    },
    settings: {
      theme: {
        type: String,
        default: 'light',
        enum: ['light', 'dark', 'auto'],
      },
      locale: {
        type: String,
        default: 'fr',
      },
      currency: {
        type: String,
        default: 'MAD',
      },
      timezone: {
        type: String,
        default: 'Africa/Casablanca',
      },
      exportStorage: {
        type: String,
        enum: ['local', 'google_drive'],
        default: 'local',
      },
      googleDriveFolderId: { type: String },
      googleDriveRefreshToken: { type: String },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['FREE', 'STARTER', 'PRO', 'ENTERPRISE'],
        default: 'FREE',
      },
      status: {
        type: String,
        enum: ['ACTIVE', 'TRIAL', 'PAST_DUE', 'CANCELED', 'SUSPENDED'],
        default: 'TRIAL',
      },
      stripeCustomerId: {
        type: String,
        default: null,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
      quotas: {
        maxUsers: { type: Number, default: 3 },
        maxStorage: { type: Number, default: 100 },
        aiRequestsPerDay: { type: Number, default: 5 },
        maxAnimals: { type: Number, default: 20 },
        maxCrops: { type: Number, default: 10 },
      },
    },
    billing: {
      lastBillingDate: { type: Date },
      nextBillingDate: { type: Date },
      paymentMethodLinked: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast slug lookup
OrganizationSchema.index({ slug: 1 });
OrganizationSchema.index({ ownerId: 1 });

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
