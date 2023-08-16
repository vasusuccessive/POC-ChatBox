import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BadRequestError } from '../entities/errors';

const validationHandler = (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(new BadRequestError(errors.array({ onlyFirstError: true }) as any));
      }
      next();
    };

export default validationHandler;