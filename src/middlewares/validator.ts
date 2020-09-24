import express from 'express';
import { validationResult } from 'express-validator';

// eslint-disable-next-line import/prefer-default-export
const checkValidation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array()
    });
    return;
  }

  next();
};

export default checkValidation;
