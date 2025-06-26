const { body, param, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
const userValidation = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    
    handleValidationErrors
  ],
  
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    
    handleValidationErrors
  ]
};

// Customer validation rules
const customerValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    
    body('phone')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Phone number must be less than 20 characters'),
    
    // Address validation for object structure
    body('address')
      .isObject()
      .withMessage('Address must be an object'),
    
    body('address.street')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Street address is required and must be less than 200 characters'),
    
    body('address.city')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('City is required and must be less than 100 characters'),
    
    body('address.state')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('State is required and must be less than 50 characters'),
    
    body('address.zipCode')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('Zip code is required and must be less than 20 characters'),
    
    body('address.country')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Country must be less than 50 characters'),
    
    body('company')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Company name must be less than 100 characters'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes must be less than 500 characters'),
    
    handleValidationErrors
  ],
  
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid customer ID format'),
    
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    
    body('phone')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Phone number must be less than 20 characters'),
    
    // Optional address validation for updates
    body('address')
      .optional()
      .isObject()
      .withMessage('Address must be an object'),
    
    body('address.street')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Street address must be less than 200 characters'),
    
    body('address.city')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('City must be less than 100 characters'),
    
    body('address.state')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('State must be less than 50 characters'),
    
    body('address.zipCode')
      .optional()
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('Zip code must be less than 20 characters'),
    
    body('address.country')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Country must be less than 50 characters'),
    
    body('company')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Company name must be less than 100 characters'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes must be less than 500 characters'),
    
    handleValidationErrors
  ],
  
  delete: [
    param('id')
      .isMongoId()
      .withMessage('Invalid customer ID format'),
    
    handleValidationErrors
  ]
};

// Invoice validation rules
const invoiceValidation = {
  create: [
    body('customerId')
      .isMongoId()
      .withMessage('Invalid customer ID format'),
    
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid date'),
    
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid due date'),
    
    body('status')
      .optional()
      .isIn(['pending', 'paid', 'overdue', 'cancelled'])
      .withMessage('Invalid status value'),
    
    body('items')
      .isArray({ min: 1 })
      .withMessage('At least one item is required'),
    
    body('items.*.description')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Item description must be between 1 and 200 characters'),
    
    body('items.*.quantity')
      .isFloat({ min: 0.01 })
      .withMessage('Quantity must be a positive number'),
    
    body('items.*.unitPrice')
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a non-negative number'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must be less than 1000 characters'),
    
    // Business info validation
    body('senderName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Sender name must be less than 100 characters'),
    
    body('senderAddress')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Sender address must be less than 200 characters'),
    
    body('senderPhone')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Sender phone must be less than 20 characters'),
    
    body('senderEmail')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid sender email address'),
    
    body('billToName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Bill to name must be less than 100 characters'),
    
    body('billToAddress')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Bill to address must be less than 200 characters'),
    
    body('billToPhone')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Bill to phone must be less than 20 characters'),
    
    body('billToEmail')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid bill to email address'),
    
    handleValidationErrors
  ],
  
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid invoice ID format'),
    
    body('customerId')
      .optional()
      .isMongoId()
      .withMessage('Invalid customer ID format'),
    
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid date'),
    
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid due date'),
    
    body('status')
      .optional()
      .isIn(['pending', 'paid', 'overdue', 'cancelled'])
      .withMessage('Invalid status value'),
    
    body('items')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least one item is required'),
    
    body('items.*.description')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Item description must be between 1 and 200 characters'),
    
    body('items.*.quantity')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Quantity must be a positive number'),
    
    body('items.*.unitPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a non-negative number'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must be less than 1000 characters'),
    
    handleValidationErrors
  ],
  
  delete: [
    param('id')
      .isMongoId()
      .withMessage('Invalid invoice ID format'),
    
    handleValidationErrors
  ]
};

// Business profile validation
const businessProfileValidation = {
  update: [
    body('businessName')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Business name must be between 2 and 100 characters'),
    
    // Address validation for object structure
    body('businessAddress')
      .isObject()
      .withMessage('Business address must be an object'),
    
    body('businessAddress.street')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Street address is required and must be less than 200 characters'),
    
    body('businessAddress.city')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('City is required and must be less than 100 characters'),
    
    body('businessAddress.state')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('State is required and must be less than 50 characters'),
    
    body('businessAddress.zipCode')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('Zip code is required and must be less than 20 characters'),
    
    body('businessAddress.country')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Country must be less than 50 characters'),
    
    body('businessPhone')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Business phone must be less than 20 characters'),
    
    body('businessEmail')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid business email address'),
    
    body('taxId')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Tax ID must be less than 50 characters'),
    
    body('website')
      .optional()
      .isURL()
      .withMessage('Please provide a valid website URL'),
    
    handleValidationErrors
  ]
};

module.exports = {
  userValidation,
  customerValidation,
  invoiceValidation,
  businessProfileValidation,
  handleValidationErrors
}; 