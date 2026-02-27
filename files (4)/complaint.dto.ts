/**
 * dto/complaint.dto.ts
 * Validation chains for complaint CRUD endpoints.
 */
import { body, query, param } from 'express-validator';

export const CreateComplaintDto = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Title must be 5–200 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10–5000 characters'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isString(),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value'),

  body('assignedTo')
    .optional()
    .isMongoId().withMessage('assignedTo must be a valid user ID'),
];

export const UpdateComplaintDto = [
  param('id').isMongoId().withMessage('Invalid complaint ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 }),

  body('status')
    .optional()
    .isIn(['open', 'in_progress', 'resolved', 'closed', 'rejected'])
    .withMessage('Invalid status value'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']),

  body('assignedTo')
    .optional()
    .isMongoId(),
];

export const QueryComplaintDto = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100')
    .toInt(),

  query('status')
    .optional()
    .isIn(['open', 'in_progress', 'resolved', 'closed', 'rejected']),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'priority', 'status']),

  query('order')
    .optional()
    .isIn(['asc', 'desc']),
];
