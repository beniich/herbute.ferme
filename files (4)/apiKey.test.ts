/**
 * tests/apiKey.test.ts
 * Unit tests for API key service — generate, validate, rotate, revoke.
 */
import mongoose from 'mongoose';
import { apiKeyService } from '../src/services/apiKeyService';
import { ApiKey } from '../src/models/ApiKey';
import { NotFoundAppError } from '../src/AppError';

const TEST_DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/reclamtrack_test';

const mockOrgId = new mongoose.Types.ObjectId().toString();
const mockUserId = new mongoose.Types.ObjectId().toString();

beforeAll(async () => {
  process.env.API_KEY_SALT = 'test_api_salt_16ch';
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  await ApiKey.deleteMany({ orgId: mockOrgId });
  await mongoose.connection.close();
});

afterEach(async () => {
  await ApiKey.deleteMany({ orgId: mockOrgId });
});

describe('apiKeyService.generateApiKey', () => {
  it('should return a raw key with rt_ prefix', async () => {
    const { rawKey, apiKey } = await apiKeyService.generateApiKey({
      orgId: mockOrgId,
      createdBy: mockUserId,
      name: 'Test Key',
      scopes: ['complaints:read'],
    });

    expect(rawKey).toMatch(/^rt_[a-f0-9]{64}$/);
    expect(apiKey._id).toBeDefined();
    expect(apiKey.name).toBe('Test Key');
    expect(apiKey.isActive).toBe(true);
  });

  it('should NOT store the raw key (only the hash)', async () => {
    const { rawKey } = await apiKeyService.generateApiKey({
      orgId: mockOrgId,
      createdBy: mockUserId,
      name: 'Hash Test',
    });

    const stored = await ApiKey.findOne({ orgId: mockOrgId });
    expect(stored!.keyHash).not.toBe(rawKey);
    // keyHash should be a 64-char hex string (SHA-256 HMAC)
    expect(stored!.keyHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should set expiry when expiresInDays is provided', async () => {
    const { apiKey } = await apiKeyService.generateApiKey({
      orgId: mockOrgId,
      createdBy: mockUserId,
      name: 'Expiring Key',
      expiresInDays: 30,
    });

    expect(apiKey.expiresAt).toBeDefined();
    const daysFromNow = Math.round(
      (apiKey.expiresAt!.getTime() - Date.now()) / 86400_000
    );
    expect(daysFromNow).toBe(30);
  });
});

describe('apiKeyService.validateApiKey', () => {
  it('should return the key record for a valid key', async () => {
    const { rawKey } = await apiKeyService.generateApiKey({
      orgId: mockOrgId,
      createdBy: mockUserId,
      name: 'Validate Test',
    });

    const result = await apiKeyService.validateApiKey(rawKey);
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Validate Test');
    expect(result!.isActive).toBe(true);
  });

  it('should return null for an unknown key', async () => {
    const result = await apiKeyService.validateApiKey('rt_unknownkey123456789');
    expect(result).toBeNull();
  });

  it('should return null for a revoked key', async () => {
    const { rawKey, apiKey } = await apiKeyService.generateApiKey({
      orgId: mockOrgId,
      createdBy: mockUserId,
      name: 'Revoke Test',
    });

    await apiKeyService.revokeApiKey(apiKey._id.toString());

    const result = await apiKeyService.validateApiKey(rawKey);
    expect(result).toBeNull();
  });

  it('should return null for an expired key', async () => {
    const { rawKey, apiKey } = await apiKeyService.generateApiKey({
      orgId: mockOrgId,
      createdBy: mockUserId,
      name: 'Expired Test',
    });

    // Manually expire the key
    await ApiKey.findByIdAndUpdate(apiKey._id, {
      expiresAt: new Date(Date.now() - 1000), // past
    });

    const result = await apiKeyService.validateApiKey(rawKey);
    expect(result).toBeNull();
  });
});

describe('apiKeyService.rotateApiKey', () => {
  it('should revoke old key and return new raw key', async () => {
    const { rawKey: oldKey, apiKey } = await apiKeyService.generateApiKey({
      orgId: mockOrgId,
      createdBy: mockUserId,
      name: 'Rotate Test',
    });

    const { rawKey: newKey } = await apiKeyService.rotateApiKey(
      apiKey._id.toString(),
      mockUserId,
    );

    expect(newKey).not.toBe(oldKey);
    expect(newKey).toMatch(/^rt_/);

    // Old key should be invalid
    const oldValid = await apiKeyService.validateApiKey(oldKey);
    expect(oldValid).toBeNull();

    // New key should be valid
    const newValid = await apiKeyService.validateApiKey(newKey);
    expect(newValid).not.toBeNull();
  });

  it('should throw NotFoundAppError for non-existent key', async () => {
    await expect(
      apiKeyService.rotateApiKey(new mongoose.Types.ObjectId().toString(), mockUserId)
    ).rejects.toThrow(NotFoundAppError);
  });
});

describe('apiKeyService.listOrgKeys', () => {
  it('should list keys without exposing keyHash', async () => {
    await apiKeyService.generateApiKey({
      orgId: mockOrgId, createdBy: mockUserId, name: 'Key 1',
    });
    await apiKeyService.generateApiKey({
      orgId: mockOrgId, createdBy: mockUserId, name: 'Key 2',
    });

    const keys = await apiKeyService.listOrgKeys(mockOrgId);
    expect(keys.length).toBe(2);

    for (const key of keys) {
      expect((key as any).keyHash).toBeUndefined();
    }
  });
});
