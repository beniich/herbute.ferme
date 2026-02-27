/**
 * dto/organization.dto.ts
 * Validation chains for organization management endpoints.
 */
import { body, param } from 'express-validator';

export const CreateOrganizationDto = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Organization name must be 2–100 characters'),

  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase letters, numbers, and hyphens only')
    .isLength({ min: 2, max: 50 }),

  body('plan')
    .optional()
    .isIn(['starter', 'pro', 'enterprise']).withMessage('Invalid plan'),
];

export const InviteMemberDto = [
  body('email')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),

  body('role')
    .isIn(['admin', 'manager', 'agent', 'viewer'])
    .withMessage('Role must be one of: admin, manager, agent, viewer'),
];

export const UpdateMemberRoleDto = [
  param('memberId').isMongoId().withMessage('Invalid member ID'),

  body('role')
    .isIn(['admin', 'manager', 'agent', 'viewer'])
    .withMessage('Invalid role'),
];

export const CreateApiKeyDto = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('scopes')
    .isArray({ min: 1 }).withMessage('At least one scope is required')
    .custom((scopes: string[]) => {
      const valid = ['complaints:read', 'complaints:write', 'organizations:read', 'reports:read', '*'];
      return scopes.every(s => valid.includes(s));
    }).withMessage('Invalid scope value'),

  body('rateLimit')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Rate limit must be 1–10000'),

  body('expiresInDays')
    .optional()
    .isInt({ min: 1, max: 365 }).withMessage('Expiry must be 1–365 days'),
];
