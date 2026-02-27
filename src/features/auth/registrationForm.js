/**
 * Registration Form Handler
 * Handles user registration with password strength meter
 */

import i18next from 'i18next';
import { showInlineAlert, clearInlineAlerts } from '../common/inlineAlert';
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
  setupPasswordToggle('password', 'password-toggle');
  setupPasswordToggle('repassword', 'repassword-toggle');

  // Setup password strength meter
  setupPasswordStrengthMeter();

  // Setup captcha refresh
  setupCaptchaRefresh('captcha-refresh', 'captcha-img');

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
    tellphon: { type: 'phone' },
    username: { type: 'username' },
    password: { type: 'password' },
  };

  Object.entries(fields).forEach(([fieldName, config]) => {
    const field = form.querySelector(`#${fieldName}`);
    if (!field) return;

    field.addEventListener('blur', () => {
      if (field.value.trim() !== '' || fieldName === 'firstname' || fieldName === 'lastname' || fieldName === 'tellphon' || fieldName === 'username') {
        validateField(field, config.type);
      }
    });

    field.addEventListener('input', () => {
      clearFieldError(field);
    });
  });

  // Special handling for confirm password
  const confirmPasswordField = form.querySelector('#repassword');
  confirmPasswordField?.addEventListener('blur', () => validatePasswordMatch());
  confirmPasswordField?.addEventListener('input', () => clearFieldError(confirmPasswordField));
}

/**
 * Setup password strength meter
 */
function setupPasswordStrengthMeter() {
  const passwordField = document.getElementById('password');
  const strengthBar = document.getElementById('password-strength');

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
  const passwordField = document.getElementById('password');
  const confirmPasswordField = document.getElementById('repassword');

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
function handleRegistrationSubmit(e) {
  const form = e.target;

  // Clear previous alerts
  clearInlineAlerts('alerts');

  // Collect form data
  const formData = {
    firstname: form.querySelector('#firstname').value,
    lastname: form.querySelector('#lastname').value,
    email: form.querySelector('#email').value,
    tellphon: form.querySelector('#tellphon').value,
    national_code: form.querySelector('#national_code').value,
    gender: form.querySelector('#gender').value,
    username: form.querySelector('#username').value,
    password: form.querySelector('#password').value,
    repassword: form.querySelector('#repassword').value,
  };

  // Validate all required fields
  let isValid = true;

  if (!validateField(form.querySelector('#firstname'), 'required')) {
    isValid = false;
  }

  if (!validateField(form.querySelector('#lastname'), 'required')) {
    isValid = false;
  }

  if (formData.email && !validateField(form.querySelector('#email'), 'email')) {
    isValid = false;
  }

  if (!validateField(form.querySelector('#tellphon'), 'phone')) {
    isValid = false;
  }

  if (!validateField(form.querySelector('#username'), 'username')) {
    isValid = false;
  }

  if (!validateField(form.querySelector('#password'), 'password')) {
    isValid = false;
  }

  if (!validatePasswordMatch()) {
    isValid = false;
  }

  if (!isValid) {
    e.preventDefault(); // Prevent form submission
    showInlineAlert('error', i18next.t('auth.validation.fixErrors', 'Please fix the errors'), 'alerts');
    return;
  }

  // If validation passes, allow form to submit naturally
  // The form will POST to the server with espritaction=signup
  // Server will handle registration and return the page with {signupmsg}
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
      icon.className = isPassword ? 'es esprit-fi-rr-eye-crossed' : 'es esprit-fi-rr-eye';
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
    // Refresh captcha image from server
    captchaImg.src = `/inc/ajax.ashx?action=captcha&${Math.random()}`;

    // Add spin animation
    const icon = refreshBtn.querySelector('i');
    if (icon) {
      icon.style.animation = 'spin 0.5s linear';
      setTimeout(() => {
        icon.style.animation = '';
      }, 500);
    }
  });
}
