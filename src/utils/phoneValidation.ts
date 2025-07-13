// Tanzania phone number validation utilities

export const validateTzPhone = (phone: string): boolean => {
  // Tanzania phone numbers: +255 followed by 9 digits, or 0 followed by 9 digits
  const tzPhoneRegex = /^(\+255|0)[67][0-9]{8}$/;
  return tzPhoneRegex.test(phone);
};

export const formatTzPhone = (phone: string): string => {
  // Remove any spaces, dashes, or parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // If starts with 0, replace with +255
  if (cleaned.startsWith('0')) {
    return '+255' + cleaned.substring(1);
  }
  
  // If already starts with +255, return as is
  if (cleaned.startsWith('+255')) {
    return cleaned;
  }
  
  // If starts with 255, add +
  if (cleaned.startsWith('255')) {
    return '+' + cleaned;
  }
  
  // If it's a 9-digit number starting with 6 or 7, add +255
  if (/^[67][0-9]{8}$/.test(cleaned)) {
    return '+255' + cleaned;
  }
  
  return phone; // Return original if can't format
};

export const displayTzPhone = (phone: string): string => {
  const formatted = formatTzPhone(phone);
  if (formatted.startsWith('+255')) {
    // Format as +255 XXX XXX XXX
    const number = formatted.substring(4);
    return `+255 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  }
  return formatted;
};

export const getTzPhoneError = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (!validateTzPhone(cleaned)) {
    return 'Please enter a valid Tanzania phone number (e.g., +255712345678 or 0712345678)';
  }
  
  return null;
};