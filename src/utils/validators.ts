/**
 * Email validation using regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Password strength validation
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate expense amount
 */
export const validateExpenseAmount = (amount: number | string): {
  isValid: boolean;
  error?: string;
} => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Amount must be a valid number' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (numAmount > 100000) {
    return { isValid: false, error: 'Amount cannot exceed $100,000' };
  }
  
  // Check for more than 2 decimal places
  const decimalPlaces = (numAmount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { isValid: false, error: 'Amount cannot have more than 2 decimal places' };
  }
  
  return { isValid: true };
};

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate: Date | string, endDate: Date | string): {
  isValid: boolean;
  error?: string;
} => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    if (start > end) {
      return { isValid: false, error: 'Start date cannot be after end date' };
    }
    
    const now = new Date();
    if (start > now) {
      return { isValid: false, error: 'Start date cannot be in the future' };
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid date format' };
  }
};

/**
 * Validate file upload
 */
export const validateFile = (file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
} = {}): {
  isValid: boolean;
  error?: string;
} => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'] } = options;
  
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return { isValid: false, error: `File size cannot exceed ${maxSizeMB}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not supported. Please upload JPEG, PNG, or PDF files only.' };
  }
  
  return { isValid: true };
};

/**
 * Validate phone number (basic US format)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate expense description
 */
export const validateDescription = (description: string, options: {
  minLength?: number;
  maxLength?: number;
} = {}): {
  isValid: boolean;
  error?: string;
} => {
  const { minLength = 5, maxLength = 500 } = options;
  const trimmedDescription = description.trim();
  
  if (trimmedDescription.length < minLength) {
    return { isValid: false, error: `Description must be at least ${minLength} characters long` };
  }
  
  if (trimmedDescription.length > maxLength) {
    return { isValid: false, error: `Description cannot exceed ${maxLength} characters` };
  }
  
  return { isValid: true };
};

/**
 * Validate form data with multiple fields
 */
export const validateForm = (data: Record<string, any>, rules: Record<string, {
  required?: boolean;
  validator?: (value: any) => { isValid: boolean; error?: string };
}>): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  
  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field];
    
    // Check required
    if (rule.required && !isRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }
    
    // Run custom validator if provided and field has value
    if (rule.validator && value !== null && value !== undefined && value !== '') {
      const validation = rule.validator(value);
      if (!validation.isValid && validation.error) {
        errors[field] = validation.error;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize HTML input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};