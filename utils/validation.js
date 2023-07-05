import { validationResult } from 'express-validator';
import HTTP_STATUS from '../constants/httpStatus.js';
import { EntityError, ErrorWithStatus } from '../models/Errors.js';
// can be reused by many routes
// sequential processing, stops running validations chain if the previous one fails.
export const validate = validations => {
    return async (req, res, next) => {
      for (let validation of validations) {
        const result = await validation.run(req);
        if (result.errors.length) break;
      }
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res.status(422).json({ errors: errors.array() });
    };
  };
