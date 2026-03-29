export const validationRules = {
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 50, message: 'Name must not exceed 50 characters' },
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
  },
  password: {
    required: 'Password is required',
    minLength: { value: 6, message: 'Password must be at least 6 characters' },
    maxLength: { value: 30, message: 'Password must not exceed 30 characters' },
  },
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: 'Invalid phone number (must be 10 digits starting with 6-9)',
    },
  },
  address: {
    required: 'Address is required',
    minLength: { value: 10, message: 'Address must be at least 10 characters' },
  },
  product: {
    required: 'Product name is required',
    minLength: { value: 3, message: 'Product name must be at least 3 characters' },
  },
  price: {
    required: 'Price is required',
    min: { value: 1, message: 'Price must be at least ₹1' },
    max: { value: 10000, message: 'Price must not exceed ₹10,000' },
  },
};

/**
 * Validate form field
 */
export const validateField = (fieldName, value, rules) => {
  const fieldRules = rules[fieldName];
  if (!fieldRules) return null;

  // Required validation
  if (fieldRules.required && !value) {
    return fieldRules.required;
  }

  // Min length validation
  if (fieldRules.minLength && value.length < fieldRules.minLength.value) {
    return fieldRules.minLength.message;
  }

  // Max length validation
  if (fieldRules.maxLength && value.length > fieldRules.maxLength.value) {
    return fieldRules.maxLength.message;
  }

  // Pattern validation
  if (fieldRules.pattern && !fieldRules.pattern.value.test(value)) {
    return fieldRules.pattern.message;
  }

  // Min value validation
  if (fieldRules.min && parseFloat(value) < fieldRules.min.value) {
    return fieldRules.min.message;
  }

  // Max value validation
  if (fieldRules.max && parseFloat(value) > fieldRules.max.value) {
    return fieldRules.max.message;
  }

  return null;
};

/**
 * Validate entire form
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  Object.keys(formData).forEach((field) => {
    const error = validateField(field, formData[field], rules);
    if (error) {
      errors[field] = error;
    }
  });
  return errors;
};

/**
 * Check if form has errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};