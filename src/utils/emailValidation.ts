// Email validation utilities with security enhancements

const COMMON_DISPOSABLE_DOMAINS = [
  '10minutemail.com',
  'guerrillamail.com',
  'tempmail.org',
  'yopmail.com',
  'mailinator.com',
  'temp-mail.org',
  'throwaway.email',
  'trash-mail.com',
  'getnada.com',
  'temp.local' // Our own temp domain
];

const VALID_TLD_PATTERN = /\.[a-z]{2,}$/i;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export const validateEmail = (email: string): EmailValidationResult => {
  const trimmedEmail = email.trim().toLowerCase();
  
  // Basic format validation
  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return {
      isValid: false,
      error: "Please enter a valid email address format."
    };
  }

  // Length validation
  if (trimmedEmail.length > 320) { // RFC 5321 limit
    return {
      isValid: false,
      error: "Email address is too long."
    };
  }

  const [localPart, domain] = trimmedEmail.split('@');
  
  // Local part validation
  if (localPart.length > 64) { // RFC 5321 limit
    return {
      isValid: false,
      error: "Email address local part is too long."
    };
  }

  // Domain validation
  if (!VALID_TLD_PATTERN.test(domain)) {
    return {
      isValid: false,
      error: "Please enter an email with a valid domain."
    };
  }

  // Check for disposable email domains
  const warnings: string[] = [];
  if (COMMON_DISPOSABLE_DOMAINS.some(disposableDomain => 
    domain === disposableDomain || domain.endsWith('.' + disposableDomain)
  )) {
    warnings.push("Consider using a permanent email address for better account security.");
  }

  // Check for suspicious patterns
  if (localPart.includes('test') || localPart.includes('fake') || localPart.includes('spam')) {
    warnings.push("This email appears to be a test address.");
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

export const sanitizeEmailInput = (email: string): string => {
  return email.trim().toLowerCase().replace(/[<>\"']/g, '');
};