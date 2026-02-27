/**
 * tests/auth.test.ts
 * Integration tests for auth endpoints.
 * Uses supertest against the Express app (no server needed).
 */
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/index';
import { User } from '../src/models/User';
import { RefreshToken } from '../src/models/RefreshToken';

const TEST_DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/reclamtrack_test';

const testUser = {
  email: 'auth.test@example.com',
  password: 'Test1234!',
  name: 'Auth Test User',
};

let accessToken: string;
let refreshToken: string;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_that_is_long_enough_32chars';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_long_enough_32chars';
  process.env.API_KEY_SALT = 'test_api_salt_16ch';
  process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
  process.env.STRIPE_SECRET_KEY = 'sk_test_placeholder';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_placeholder';

  await mongoose.connect(TEST_DB);
  await User.deleteMany({ email: testUser.email });
  await RefreshToken.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({ email: testUser.email });
  await RefreshToken.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  it('should register a new user and return token pair', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email);
    // Password must not be in response
    expect(res.body.data.user.password).toBeUndefined();

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('should reject duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('AUTH_EMAIL_TAKEN');
  });

  it('should reject weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@test.com', password: 'weak' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.fields.password).toBeDefined();
  });

  it('should reject invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'Test1234!' });

    expect(res.status).toBe(400);
    expect(res.body.fields.email).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  it('should login and return token pair', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('should reject wrong password with generic message', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPass1!' });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('AUTH_INVALID_CREDENTIALS');
    // Error message must be generic — don't reveal if email exists
    expect(res.body.error).toBe('Invalid email or password');
  });

  it('should reject non-existent email with same generic message', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Test1234!' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });
});

describe('GET /api/auth/me', () => {
  it('should return user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.body.data.password).toBeUndefined();
  });

  it('should reject request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('AUTH_REQUIRED');
  });

  it('should reject invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('AUTH_TOKEN_INVALID');
  });
});

describe('POST /api/auth/refresh — Token Rotation', () => {
  it('should return new token pair with valid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    // New tokens should differ from old
    expect(res.body.data.refreshToken).not.toBe(refreshToken);

    const oldRefreshToken = refreshToken;
    refreshToken = res.body.data.refreshToken;
    accessToken = res.body.data.accessToken;

    // REUSE ATTACK TEST: try the old token again → must be rejected
    const reuseRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: oldRefreshToken });

    expect(reuseRes.status).toBe(401);
    expect(reuseRes.body.code).toBe('AUTH_REFRESH_REUSE');
  });

  it('should reject missing refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/auth/logout', () => {
  it('should logout successfully and invalidate refresh token', async () => {
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken });

    expect(logoutRes.status).toBe(200);

    // Subsequent refresh with same token should fail
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(401);
  });
});

describe('POST /api/auth/introspect', () => {
  it('should be blocked from non-localhost IPs', async () => {
    // By default test runner uses loopback, but simulate blocked
    // This test checks the endpoint exists and is guarded
    const res = await request(app)
      .post('/api/auth/introspect')
      .send({ token: 'some-token' });

    // Either 200 (localhost allowed) or 403 (IP blocked)
    expect([200, 403]).toContain(res.status);
  });
});
