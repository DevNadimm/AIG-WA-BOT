export interface ValidationResult {
  valid: boolean;
  normalizedValue?: any;
  error?: string;
}

export function validateField(input: string, type: string, config?: any): ValidationResult {
  if (!input) {
    return { valid: false, error: 'Input is empty' };
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Input is empty' };
  }

  switch (type.toUpperCase()) {
    case 'STRING':
    case 'TEXT':
      return { valid: true, normalizedValue: trimmed };

    case 'NUMBER':
      const num = Number(trimmed);
      if (isNaN(num)) {
        return { valid: false, error: 'Must be a valid number' };
      }
      return { valid: true, normalizedValue: num };

    case 'BOOLEAN':
      const lower = trimmed.toLowerCase();
      if (['yes', 'y', 'true', '1', 'ok', 'sure'].includes(lower)) {
        return { valid: true, normalizedValue: true };
      }
      if (['no', 'n', 'false', '0', 'cancel'].includes(lower)) {
        return { valid: true, normalizedValue: false };
      }
      return { valid: false, error: 'Must be yes/no or true/false' };

    case 'PHONE':
      // Basic normalization: remove spaces, dashes, parentheses
      const phoneNorm = trimmed.replace(/[\s\-\(\)]/g, '');
      // Regex for generic phone number (optional +, followed by 7-15 digits)
      if (!/^\+?[0-9]{7,15}$/.test(phoneNorm)) {
        return { valid: false, error: 'Must be a valid phone number' };
      }
      return { valid: true, normalizedValue: phoneNorm };

    case 'EMAIL':
      const emailNorm = trimmed.toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailNorm)) {
        return { valid: false, error: 'Must be a valid email address' };
      }
      return { valid: true, normalizedValue: emailNorm };

    case 'DATE':
      const d = new Date(trimmed);
      if (isNaN(d.getTime())) {
        return { valid: false, error: 'Must be a valid date format (e.g. YYYY-MM-DD)' };
      }
      return { valid: true, normalizedValue: d.toISOString().split('T')[0] }; // Canonical YYYY-MM-DD

    case 'ENUM':
      if (!config?.options || !Array.isArray(config.options)) {
         return { valid: true, normalizedValue: trimmed }; // fallback
      }
      const match = config.options.find((opt: string) => opt.toLowerCase() === trimmed.toLowerCase());
      if (!match) {
        return { valid: false, error: `Must be one of: ${config.options.join(', ')}` };
      }
      return { valid: true, normalizedValue: match };

    case 'REGEX':
      if (!config?.pattern) {
        return { valid: true, normalizedValue: trimmed };
      }
      const regex = new RegExp(config.pattern);
      if (!regex.test(trimmed)) {
        return { valid: false, error: 'Format is invalid' };
      }
      return { valid: true, normalizedValue: trimmed };

    default:
      return { valid: true, normalizedValue: trimmed };
  }
}
