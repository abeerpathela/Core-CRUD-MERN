export const validateUser = (req, res, next) => {
  const { name, username, email, phone } = req.body;
  const errors = {};

  if (!name || name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!username || username.trim() === '') {
    errors.username = 'Username is required';
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Valid email is required';
  }

  if (!phone || isNaN(phone)) {
    errors.phone = 'Valid phone number is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  next();
};
