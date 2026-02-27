/**
 * tests/tokenService.test.ts
 * Unit tests for tokenService — token issuance, rotation, reuse detection.
 */
import mongoose from 'mongoose';
import { tokenService } from '../src/services/tokenService';
import { RefreshToken } from '../src/models/RefreshToken';
import { RefreshTokenReuseError, RefreshTokenError } from '../src/AppError';

const TEST_DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/reclamtrack_test';

const mockUser = {
  id: new mongoose.Types.ObjectId().toString(),
  orgId: new mongoose.Types.ObjectId().toString(),
  role: 'agent',
};

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret_key_that_is_long_enough_32chars';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_long_enough_32chars';
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  await RefreshToken.deleteMany({});
  await mongoose.connection.close();
});

afterEach(async () => {
  await RefreshToken.deleteMany({});
});

describe('tokenService.issueTokenPair', () => {
  it('should return accessToken and refreshToken', async () => {
    const { accessToken, refreshToken } = await tokenService.issueTokenPair(mockUser);

    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');
    expect(refreshToken).toMatch(/^rt_/); // Check prefix
  });

  it('should store hashed refresh token in DB (not raw)', async () => {
    const { refreshToken } = await tokenService.issueTokenPair(mockUser);

    const stored = await RefreshToken.findOne({});
    expect(stored).not.toBeNull();
    // Raw token must NOT be stored
    expect(stored!.tokenHash).not.toBe(refreshToken);
    // Hash should be a hex string
    expect(stored!.tokenHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should create unique families for each issueTokenPair call', async () => {
    const p1 = await tokenService.issueTokenPair(mockUser);
    const p2 = await tokenService.issueTokenPair(mockUser);

    const tokens = await RefreshToken.find({});
    expect(tokens.length).toBe(2);
    expect(tokens[0].family).not.toBe(tokens[1].family);
  });
});

describe('tokenService.rotateRefreshToken', () => {
  it('should return a new token pair and revoke the old token', async () => {
    const { refreshToken } = await tokenService.issueTokenPair(mockUser);
    const newPair = await tokenService.rotateRefreshToken(refreshToken);

    expect(newPair.accessToken).toBeDefined();
    expect(newPair.refreshToken).toBeDefined();
    expect(newPair.refreshToken).not.toBe(refreshToken);

    // Old token should be revoked
    const allTokens = await RefreshToken.find({});
    const revoked = allTokens.find(t => t.isRevoked());
    expect(revoked).toBeDefined();
  });

  it('should maintain the same family during rotation', async () => {
    const { refreshToken } = await tokenService.issueTokenPair(mockUser);
    const originalFamily = (await RefreshToken.findOne({}))!.family;

    await tokenService.rotateRefreshToken(refreshToken);

    const allTokens = await RefreshToken.find({});
    // All tokens should share the same family
    for (const token of allTokens) {
      expect(token.family).toBe(originalFamily);
    }
  });

  it('should reject a token that does not exist', async () => {
    await expect(
      tokenService.rotateRefreshToken('rt_nonexistenttoken12345')
    ).rejects.toThrow(RefreshTokenError);
  });
});

describe('tokenService — Refresh Token Reuse Attack Detection', () => {
  it('should revoke entire family when reused token is detected', async () => {
    const { refreshToken: token1 } = await tokenService.issueTokenPair(mockUser);

    // Legitimate rotation
    await tokenService.rotateRefreshToken(token1);

    // Attacker replays old token
    await expect(
      tokenService.rotateRefreshToken(token1)
    ).rejects.toThrow(RefreshTokenReuseError);

    // All tokens in the family should now be revoked
    const allTokens = await RefreshToken.find({});
    const anyValid = allTokens.some(t => t.isValid());
    expect(anyValid).toBe(false);
  });
});

describe('tokenService.revokeRefreshToken', () => {
  it('should mark the token as revoked', async () => {
    const { refreshToken } = await tokenService.issueTokenPair(mockUser);
    await tokenService.revokeRefreshToken(refreshToken);

    const token = await RefreshToken.findOne({});
    expect(token!.isRevoked()).toBe(true);
  });
});

describe('tokenService.introspect', () => {
  it('should return payload for a valid access token', async () => {
    const { accessToken } = await tokenService.issueTokenPair(mockUser);
    const payload = await tokenService.introspect(accessToken);

    expect(payload).not.toBeNull();
    expect(payload!.sub).toBe(mockUser.id);
    expect(payload!.orgId).toBe(mockUser.orgId);
    expect(payload!.role).toBe(mockUser.role);
  });

  it('should return null for an invalid token', async () => {
    const payload = await tokenService.introspect('invalid.token.here');
    expect(payload).toBeNull();
  });
});
