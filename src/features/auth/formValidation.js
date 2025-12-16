/**
 * Authentication Form Validation Utilities
 * Simplified validation functions for auth forms
 */

import i18next from 'i18next';

/**
 * Validate if a value is not empty
 * @param {string} value - Value to validate
 * @returns {boolean} True if valid
 */
export function validateRequired(value) {
  return value !== null && value !== undefined && value.trim() !== '';
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  if (!email || email.trim() === '') return true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate username format
 * Username must be 3-20 characters, letters, numbers, underscore only
 * @param {string} username - Username to validate
 * @returns {boolean} True if valid
 */
export function validateUsername(username) {
  if (!username || username.trim() === '') return false;

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate phone number format (Iranian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function validatePhoneNumber(phone) {
  if (!phone || phone.trim() === '') return false;

  const phoneRegex = /^(\+98|0)?9\d{9}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validate OTP code format (6 digits)
 * @param {string} code - OTP code to validate
 * @returns {boolean} True if valid
 */
export function validateOTP(code) {
  if (!code || code.trim() === '') return false;

  return /^\d{6}$/.test(code.trim());
}

/**
 * Validate password strength
 * Password must contain uppercase, lowercase, and number
 * @param {string} password - Password to validate
 * @returns {object} {valid: boolean, strength: 'weak'|'medium'|'strong'}
 */
export function validatePassword(password) {
  if (!password || password.trim() === '') {
    return { valid: false, strength: null };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  const criteriaCount = [hasUppercase, hasLowercase, hasNumber, hasMinLength].filter(Boolean).length;

  let strength = 'weak';
  if (criteriaCount >= 4) {
    strength = 'strong';
  } else if (criteriaCount >= 3) {
    strength = 'medium';
  }

  const valid = hasUppercase && hasLowercase && hasNumber;

  return { valid, strength };
}

/**
 * Show error message below a form field
 * @param {HTMLElement} field - Input field element
 * @param {string} message - Error message to display
 */
export function showFieldError(field, message) {
  if (!field) return;

  // Add error class to input
  field.classList.add('nes-input--error');

  // Find or create error message element
  const fieldGroup = field.closest('.nes-form-group, .nes-input-wrapper');
  if (!fieldGroup) return;

  let errorElement = fieldGroup.querySelector('.auth-field-error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'auth-field-error';
    fieldGroup.appendChild(errorElement);
  }

  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

/**
 * Clear error state from a form field
 * @param {HTMLElement} field - Input field element
 */
export function clearFieldError(field) {
  if (!field) return;

  // Remove error class
  field.classList.remove('nes-input--error');

  // Hide error message
  const fieldGroup = field.closest('.nes-form-group, .nes-input-wrapper');
  if (!fieldGroup) return;

  const errorElement = fieldGroup.querySelector('.auth-field-error');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

/**
 * Show success state on a form field
 * @param {HTMLElement} field - Input field element
 */
export function showFieldSuccess(field) {
  if (!field) return;

  clearFieldError(field);
  field.classList.add('nes-input--success');
}

/**
 * Clear success state from a form field
 * @param {HTMLElement} field - Input field element
 */
export function clearFieldSuccess(field) {
  if (!field) return;

  field.classList.remove('nes-input--success');
}

/**
 * Validate field with specific rules
 * @param {HTMLElement} field - Input field element
 * @param {string} type - Type of validation ('required', 'email', 'username', 'phone', 'password', 'otp')
 * @returns {boolean} True if valid
 */
export function validateField(field, type) {
  if (!field) return false;

  const value = field.value;
  let isValid = true;
  let errorMessage = '';

  switch (type) {
    case 'required':
      isValid = validateRequired(value);
      errorMessage = i18next.t('auth.validation.required');
      break;

    case 'email':
      isValid = validateEmail(value);
      errorMessage = i18next.t('auth.validation.invalidEmail');
      break;

    case 'username':
      isValid = validateUsername(value);
      errorMessage = i18next.t('auth.validation.invalidUsername');
      break;

    case 'phone':
      isValid = validatePhoneNumber(value);
      errorMessage = i18next.t('auth.validation.invalidPhone');
      break;

    case 'password':
      const passwordResult = validatePassword(value);
      isValid = passwordResult.valid;
      errorMessage = i18next.t('auth.validation.weakPassword');
      break;

    case 'otp':
      isValid = validateOTP(value);
      errorMessage = i18next.t('auth.validation.invalidOTP');
      break;

    default:
      isValid = true;
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  } else {
    clearFieldError(field);
  }

  return isValid;
}
