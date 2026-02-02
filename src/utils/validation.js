// Validation utilities for form inputs

export const validation = {
  // Email validation
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
  },

  // Password validation
  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  },

  // Name validation
  name: (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return null;
  },

  // Required field validation
  required: (value, fieldName = 'This field') => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  },

  // Number validation
  number: (value, fieldName = 'This field') => {
    if (isNaN(value)) return `${fieldName} must be a number`;
    return null;
  },

  // Positive number validation
  positiveNumber: (value, fieldName = 'This field') => {
    if (isNaN(value)) return `${fieldName} must be a number`;
    if (parseFloat(value) <= 0) return `${fieldName} must be positive`;
    return null;
  },

  // Phone validation (basic)
  phone: (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return 'Invalid phone number (10 digits required)';
    }
    return null;
  },

  // Confirm password validation
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  }
};

// Validate multiple fields at once
export const validateForm = (fields) => {
  const errors = {};
  let isValid = true;

  Object.keys(fields).forEach((key) => {
    const { value, validator, fieldName } = fields[key];
    const error = validator(value, fieldName);
    if (error) {
      errors[key] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
