/**
 * Form Validation Utilities
 * Reusable validation functions for profile forms
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
  if (!email || email.trim() === '') return true; // Empty is valid (use validateRequired for required check)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export function validateURL(url) {
  if (!url || url.trim() === '') return true; // Empty is valid

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
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
  const fieldGroup = field.closest('.nes-form-group');
  if (!fieldGroup) return;

  const errorElement = fieldGroup.querySelector('.profile-edit__field-error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

/**
 * Clear error state from a form field
 * @param {HTMLElement} field - Input field element
 */
export function clearFieldError(field) {
  if (!field) return;

  // Remove error class
  field.classList.remove('nes-input--error');
  field.classList.remove('nes-input--success');

  // Clear error message
  const fieldGroup = field.closest('.nes-form-group');
  if (!fieldGroup) return;

  const errorElement = fieldGroup.querySelector('.profile-edit__field-error');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

/**
 * Show success state on a form field
 * @param {HTMLElement} field - Input field element
 */
export function showFieldSuccess(field) {
  if (!field) return;

  // Remove error class and add success class
  field.classList.remove('nes-input--error');
  field.classList.add('nes-input--success');

  // Clear error message
  const fieldGroup = field.closest('.nes-form-group');
  if (!fieldGroup) return;

  const errorElement = fieldGroup.querySelector('.profile-edit__field-error');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

/**
 * Validate a form field based on its type and rules
 * @param {HTMLElement} field - Input field to validate
 * @param {object} rules - Validation rules {required, email, url, etc.}
 * @returns {boolean} True if valid
 */
export function validateField(field, rules = {}) {
  if (!field) return true;

  const value = field.value;
  clearFieldError(field);

  // Required validation
  if (rules.required && !validateRequired(value)) {
    showFieldError(field, i18next.t('profile.validation.required', 'این فیلد الزامی است'));
    return false;
  }

  // Email validation
  if (rules.email && value.trim() !== '' && !validateEmail(value)) {
    showFieldError(field, i18next.t('profile.validation.invalidEmail', 'ایمیل معتبر نیست'));
    return false;
  }

  // URL validation
  if (rules.url && value.trim() !== '' && !validateURL(value)) {
    showFieldError(field, i18next.t('profile.validation.invalidURL', 'آدرس وب سایت معتبر نیست'));
    return false;
  }

  // Password validation
  if (rules.password) {
    const passwordResult = validatePassword(value);
    if (!passwordResult.valid) {
      showFieldError(
        field,
        i18next.t(
          'profile.validation.weakPassword',
          'رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد'
        )
      );
      return false;
    }
  }

  // If all validations pass
  if (value.trim() !== '') {
    showFieldSuccess(field);
  }

  return true;
}

/**
 * Get validation rules for a specific field by name
 * @param {string} fieldName - Name of the field
 * @returns {object} Validation rules
 */
export function getFieldRules(fieldName) {
  const rules = {
    name: { required: true },
    lastname: { required: true },
    emailaddress: { email: true },
    mobile: {},
    birthdate: {},
    gender: {},
    website: { url: true },
    linkedin: { url: true },
    instagram: { url: true },
    telegram: { url: true },
    description: {},
    oldpass: { required: true },
    newpass: { required: true, password: true },
    newpassrepeat: { required: true },
  };

  return rules[fieldName] || {};
}
