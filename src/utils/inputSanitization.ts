// Input sanitization utilities for security

export const sanitizeSearchQuery = (query: string): string => {
  // Remove potentially dangerous characters and limit length
  return query
    .trim()
    .slice(0, 100) // Limit search query length
    .replace(/[<>\"'&]/g, '') // Remove HTML/script injection chars
    .replace(/\s+/g, ' '); // Normalize whitespace
};

export const sanitizeNumericInput = (value: string): number | null => {
  // Parse and validate numeric input
  const parsed = parseInt(value.replace(/[^\d]/g, ''), 10);
  
  if (isNaN(parsed) || parsed < 0) {
    return null;
  }
  
  // Reasonable limit for quantities
  return Math.min(parsed, 10000);
};

export const sanitizeTextInput = (text: string, maxLength: number = 500): string => {
  return text
    .trim()
    .slice(0, maxLength)
    .replace(/[<>\"'&]/g, ''); // Remove potentially dangerous characters
};

export const validatePositiveNumber = (value: number, max: number = 10000): boolean => {
  return Number.isInteger(value) && value > 0 && value <= max;
};

export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing requests for this identifier
    const userRequests = requests.get(identifier) || [];
    
    // Filter out requests outside the current window
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    
    return true;
  };
};

// Rate limiters for different operations
export const searchRateLimit = createRateLimiter(10, 60000); // 10 searches per minute
export const authRateLimit = createRateLimiter(5, 300000); // 5 auth attempts per 5 minutes