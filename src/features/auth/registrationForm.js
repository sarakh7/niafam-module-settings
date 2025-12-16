/**
 * Registration Form Handler
 * Handles user registration with password strength meter
 */

import i18next from 'i18next';
import { showSuccessToast, showErrorToast } from '../common/toast';
import { registerUser } from './mockAuth';
import { validatePassword, validateField, clearFieldError, showFieldError } from './formValidation';

/**
 * Initialize registration form
 */
export function initRegistrationForm() {
  const form = document.getElementById('registration-form-element');
  if (!form) {
    console.warn('Registration form not found');
    return;
  }

  // Setup password visibility toggles
  setupPasswordToggle('reg-password', 'reg-password-toggle');
  setupPasswordToggle('reg-confirm-password', 'reg-confirm-password-toggle');

  // Setup password strength meter
  setupPasswordStrengthMeter();

  // Setup captcha refresh
  setupCaptchaRefresh('reg-captcha-refresh', 'reg-captcha-img');

  // Setup form submission
  form.addEventListener('submit', handleRegistrationSubmit);

  // Setup real-time validation
  setupRealTimeValidation(form);
}

/**
 * Setup real-time validation for form fields
 * @param {HTMLFormElement} form - Registration form
 */
function setupRealTimeValidation(form) {
  const fields = {
    firstname: { type: 'required' },
    lastname: { type: 'required' },
    email: { type: 'email' },
    phone: { type: 'phone' },
    username: { type: 'username' },
    password: { type: 'password' },
  };

  Object.entries(fields).forEach(([fieldName, config]) => {
    const field = form.querySelector(`#reg-${fieldName}`);
    if (!field) return;

    field.addEventListener('blur', () => {
      if (field.value.trim() !== '' || fieldName === 'firstname' || fieldName === 'lastname' || fieldName === 'phone' || fieldName === 'username') {
        validateField(field, config.type);
      }
    });

    field.addEventListener('input', () => {
      clearFieldError(field);
    });
  });

  // Special handling for confirm password
  const confirmPasswordField = form.querySelector('#reg-confirm-password');
  confirmPasswordField?.addEventListener('blur', () => validatePasswordMatch());
  confirmPasswordField?.addEventListener('input', () => clearFieldError(confirmPasswordField));
}

/**
 * Setup password strength meter
 */
function setupPasswordStrengthMeter() {
  const passwordField = document.getElementById('reg-password');
  const strengthBar = document.getElementById('reg-password-strength');

  if (!passwordField || !strengthBar) return;

  passwordField.addEventListener('input', () => {
    const password = passwordField.value;

    if (!password) {
      strengthBar.style.width = '0%';
      strengthBar.className = 'auth-password-strength-bar';
      return;
    }

    const result = validatePassword(password);

    if (!result.strength) {
      strengthBar.style.width = '0%';
      strengthBar.className = 'auth-password-strength-bar';
    } else {
      const widths = { weak: '33%', medium: '66%', strong: '100%' };
      strengthBar.style.width = widths[result.strength];
      strengthBar.className = `auth-password-strength-bar auth-password-strength-bar--${result.strength}`;
    }
  });
}

/**
 * Validate password match
 * @returns {boolean} True if passwords match
 */
function validatePasswordMatch() {
  const passwordField = document.getElementById('reg-password');
  const confirmPasswordField = document.getElementById('reg-confirm-password');

  if (!passwordField || !confirmPasswordField) return false;

  const password = passwordField.value;
  const confirmPassword = confirmPasswordField.value;

  if (confirmPassword === '') return true;

  if (password !== confirmPassword) {
    showFieldError(confirmPasswordField, i18next.t('auth.validation.passwordMismatch', 'Passwords do not match'));
    return false;
  }

  clearFieldError(confirmPasswordField);
  return true;
}

/**
 * Handle registration form submission
 * @param {Event} e - Submit event
 */
async function handleRegistrationSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  // Collect form data
  const formData = {
    firstname: form.querySelector('#reg-firstname').value,
    lastname: form.querySelector('#reg-lastname').value,
    email: form.querySelector('#reg-email').value,
    phone: form.querySelector('#reg-phone').value,
    nationalCode: form.querySelector('#reg-nationalcode').value,
    gender: form.querySelector('#reg-gender').value,
    username: form.querySelector('#reg-username').value,
    password: form.querySelector('#reg-password').value,
    confirmPassword: form.querySelector('#reg-confirm-password').value,
  };

  // Validate all required fields
  let isValid = true;

  if (!validateField(form.querySelector('#reg-firstname'), 'required')) {
    isValid = false;
  }

  if (!validateField(form.querySelector('#reg-lastname'), 'required')) {
    isValid = false;
  }

  if (formData.email && !validateField(form.querySelector('#reg-email'), 'email')) {
    isValid = false;
  }

  if (!validateField(form.querySelector('#reg-phone'), 'phone')) {
    isValid = false;
  }

  if (!validateField(form.querySelector('#reg-username'), 'username')) {
    isValid = false;
  }

  if (!validateField(form.querySelector('#reg-password'), 'password')) {
    isValid = false;
  }

  if (!validatePasswordMatch()) {
    isValid = false;
  }

  if (!isValid) {
    showErrorToast(i18next.t('auth.validation.fixErrors', 'Please fix the errors'));
    return;
  }

  // Show loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Creating Account...</span>';

  try {
    // Mock registration
    const result = await registerUser(formData);

    if (result.success) {
      showSuccessToast(i18next.t('auth.messages.registrationSuccess', 'Registration successful!'));

      // Clear form
      form.reset();

      // Reset password strength meter
      const strengthBar = document.getElementById('reg-password-strength');
      if (strengthBar) {
        strengthBar.style.width = '0%';
        strengthBar.className = 'auth-password-strength-bar';
      }

      // Scroll to success section
      setTimeout(() => {
        const successSection = document.getElementById('success-message');
        if (successSection) {
          successSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1000);
    } else {
      showErrorToast(result.message || i18next.t('auth.messages.registrationError', 'Registration failed'));
    }
  } catch (error) {
    console.error('Registration error:', error);
    showErrorToast(i18next.t('auth.messages.serverError', 'Server error occurred'));
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

/**
 * Setup password visibility toggle
 * @param {string} passwordId - Password input ID
 * @param {string} toggleId - Toggle button ID
 */
function setupPasswordToggle(passwordId, toggleId) {
  const passwordField = document.getElementById(passwordId);
  const toggleBtn = document.getElementById(toggleId);

  if (!passwordField || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isPassword = passwordField.type === 'password';
    passwordField.type = isPassword ? 'text' : 'password';

    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = isPassword ? 'es esprit-eye-off' : 'es esprit-eye';
    }
  });
}

/**
 * Setup captcha refresh button
 * @param {string} refreshBtnId - Refresh button ID
 * @param {string} captchaImgId - Captcha image ID
 */
function setupCaptchaRefresh(refreshBtnId, captchaImgId) {
  const refreshBtn = document.getElementById(refreshBtnId);
  const captchaImg = document.getElementById(captchaImgId);

  if (!refreshBtn || !captchaImg) return;

  refreshBtn.addEventListener('click', () => {
    const currentSrc = captchaImg.src.split('?')[0];
    captchaImg.src = `${currentSrc}?t=${Date.now()}`;

    const icon = refreshBtn.querySelector('i');
    if (icon) {
      icon.style.animation = 'spin 0.5s linear';
      setTimeout(() => {
        icon.style.animation = '';
      }, 500);
    }
  });
}
