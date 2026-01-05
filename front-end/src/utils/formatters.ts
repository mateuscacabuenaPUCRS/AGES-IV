/**
 * Utilities for data formatting and validation
 *
 * @example
 * ```typescript
 * import { formatCPF, formatPhone, formatDate, isValidCPF, isValidPhone } from '@/utils/formatters';
 *
 * // CPF formatting
 * formatCPF('12345678901') // '123.456.789-01'
 * formatCPF('123456789')   // '123.456.789'
 *
 * // CPF validation
 * isValidCPF('123.456.789-01') // false (invalid)
 * isValidCPF('111.444.777-35') // true (valid)
 *
 * // Phone formatting
 * formatPhone('11999887766') // '(11) 99988-7766' (mobile)
 * formatPhone('1133334444')  // '(11) 3333-4444' (landline)
 *
 * // Phone validation
 * isValidPhone('(11) 99999-9999') // true
 * isValidPhone('(11) 3333-4444')  // true
 *
 * // Date formatting
 * formatDate('2025-10-30T00:00:00Z') // '30/10/2025'
 * formatDate(undefined) // 'N/A'
 * ```
 */

/**
 * Formats CPF with dots and dash (XXX.XXX.XXX-XX)
 * @param value - String containing only numbers
 * @returns Formatted string or original value if invalid
 */
export const formatCPF = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Limit to 11 digits
  const limitedNumbers = numbers.slice(0, 11);

  // Apply formatting based on number of digits
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
  } else if (limitedNumbers.length <= 9) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
  }
};

/**
 * Removes CPF formatting, leaving only numbers
 * @param cpf - Formatted CPF
 * @returns String containing only numbers
 */
export const unformatCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, "");
};

/**
 * Validates if CPF is valid
 * @param cpf - CPF to validate (with or without formatting)
 * @returns Boolean indicating if it's valid
 */
export const isValidCPF = (cpf: string): boolean => {
  const numbers = unformatCPF(cpf);

  // Check if it has 11 digits
  if (numbers.length !== 11) return false;

  // Check if all digits are the same (111.111.111-11, etc.)
  if (/^(.)\1{10}$/.test(numbers)) return false;

  // Validation of first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;

  // Validation of second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;

  // Check if digits match
  return digit1 === parseInt(numbers[9]) && digit2 === parseInt(numbers[10]);
};

/**
 * Formats Brazilian phone number (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 * @param value - String containing only numbers
 * @returns Formatted string or original value if invalid
 */
export const formatPhone = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Limit to 11 digits (mobile) or 10 (landline)
  const limitedNumbers = numbers.slice(0, 11);

  // Apply formatting based on number of digits
  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
  } else {
    // Mobile: (XX) XXXXX-XXXX
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
  }
};

/**
 * Removes phone formatting, leaving only numbers
 * @param phone - Formatted phone
 * @returns String containing only numbers
 */
export const unformatPhone = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

/**
 * Validates if Brazilian phone number is valid
 * @param phone - Phone to validate (with or without formatting)
 * @returns Boolean indicating if it's valid
 */
export const isValidPhone = (phone: string): boolean => {
  const numbers = unformatPhone(phone);

  // Phone must have 10 or 11 digits
  if (numbers.length < 10 || numbers.length > 11) return false;

  // First digit must be between 1 and 9 (area code)
  const areaCode = parseInt(numbers.slice(0, 2));
  if (areaCode < 11 || areaCode > 99) return false;

  // For mobile (11 digits), third digit must be 9
  if (numbers.length === 11 && numbers[2] !== "9") return false;

  // For landline (10 digits), third digit must be between 2 and 5
  if (numbers.length === 10) {
    const thirdDigit = parseInt(numbers[2]);
    if (thirdDigit < 2 || thirdDigit > 5) return false;
  }

  return true;
};

/**
 * Automatically detects if it's mobile or landline and formats appropriately
 * @param value - Phone number
 * @returns Object with type and formatted value
 */
export const detectAndFormatPhone = (
  value: string
): { type: "mobile" | "landline" | "unknown"; formatted: string } => {
  const numbers = unformatPhone(value);
  const formatted = formatPhone(value);

  if (numbers.length === 11 && numbers[2] === "9") {
    return { type: "mobile", formatted };
  } else if (numbers.length === 10) {
    return { type: "landline", formatted };
  } else {
    return { type: "unknown", formatted };
  }
};

/**
 * Formats a date string to Brazilian format (DD/MM/YYYY)
 * Uses UTC components to avoid timezone conversion issues
 * @param dateString - ISO date string
 * @returns Formatted date string or "N/A" if invalid
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);

  // Use UTC methods to avoid timezone conversion
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};
