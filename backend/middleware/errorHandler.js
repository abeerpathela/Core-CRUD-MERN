import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || MESSAGES.INTERNAL_ERROR,
  });
};
