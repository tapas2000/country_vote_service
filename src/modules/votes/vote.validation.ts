import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { MESSAGES, HTTP_STATUS } from '../shared/constants';

export const validateVote = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.NAME_REQUIRED)
    .isLength({ min: 2, max: 100 })
    .withMessage(MESSAGES.NAME_TOO_SHORT),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(MESSAGES.INVALID_EMAIL)
    .normalizeEmail(),
  
  body('country')
    .trim()
    .notEmpty()
    .withMessage(MESSAGES.COUNTRY_REQUIRED)
    .isLength({ min: 2, max: 3 })
    .withMessage(MESSAGES.COUNTRY_INVALID_LENGTH)
    .isAlpha()
    .withMessage(MESSAGES.COUNTRY_INVALID_FORMAT)
    .toUpperCase(),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.type === 'field' ? err.path : 'unknown',
          message: err.msg
        }))
      });
    }
    next();
  }
];
