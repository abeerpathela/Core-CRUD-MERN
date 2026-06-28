export const successResponse = (res, status, data, message = 'Success') => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, status, message, errors = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};
