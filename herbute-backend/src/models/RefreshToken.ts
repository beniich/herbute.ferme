/**
 * models/RefreshToken.ts
 * Stores hashed refresh tokens with family-based reuse attack detection.
 *
 * Family = a UUID shared by all tokens in a rotation chain.
 * If an already-used token is presented, we revoke the entire family
 * (all sessions for that user/device) as a security measure.
 */
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  tokenHash: string;       // SHA-256 of the raw token — never store raw
  family: string;          // UUID — links token rotation chain
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  isExpired(): boolean;
  isRevoked(): boolean;
  isValid(): boolean;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    family: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index auto-cleanup
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'refresh_tokens',
  },
);

RefreshTokenSchema.methods.isExpired = function (): boolean {
  return new Date() > this.expiresAt;
};

RefreshTokenSchema.methods.isRevoked = function (): boolean {
  return this.revokedAt !== null && this.revokedAt !== undefined;
};

RefreshTokenSchema.methods.isValid = function (): boolean {
  return !this.isExpired() && !this.isRevoked();
};

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
