/**
 * Login Form Handler
 * Handles login form submission and validation
 */

import i18next from 'i18next';
import { showSuccessToast, showErrorToast } from '../common/toast';
import { validateLogin } from './mockAuth';
import { validateRequired, validateField, clearFieldError } from './formValidation';

/**
 * Initialize login form
 */
export function initLoginForm() {
  const form = document.getElementById('login-form-element');
  if (!form) {
    console.warn('Login form not found');
    return;
  }

  // Setup password visibility toggle
  setupPasswordToggle('login-password', 'login-password-toggle');

  // Setup captcha refresh
  setupCaptchaRefresh('login-captcha-refresh', 'login-captcha-img');

  // Setup form submission
  form.addEventListener('submit', handleLoginSubmit);

  // Setup real-time validation
  const usernameField = form.querySelector('#login-username');
  const passwordField = form.querySelector('#login-password');

  usernameField?.addEventListener('blur', () => validateField(usernameField, 'required'));
  passwordField?.addEventListener('blur', () => validateField(passwordField, 'required'));

  usernameField?.addEventListener('input', () => clearFieldError(usernameField));
  passwordField?.addEventListener('input', () => clearFieldError(passwordField));
}

/**
 * Handle login form submission
 * @param {Event} e - Submit event
 */
async function handleLoginSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const usernameField = form.querySelector('#login-username');
  const passwordField = form.querySelector('#login-password');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validate fields
  let isValid = true;

  if (!validateField(usernameField, 'required')) {
    isValid = false;
  }

  if (!validateField(passwordField, 'required')) {
    isValid = false;
  }

  if (!isValid) {
    showErrorToast(i18next.t('auth.validation.fixErrors', 'Please fix the errors'));
    return;
  }

  // Show loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span data-i18n="auth.login.submitting">Logging in...</span>';

  try {
    // Mock validation with delay
    const result = await validateLogin(usernameField.value, passwordField.value);

    if (result.success) {
      showSuccessToast(i18next.t('auth.messages.loginSuccess', 'Login successful!'));

      // Scroll to success section after short delay
      setTimeout(() => {
        const successSection = document.getElementById('success-message');
        if (successSection) {
          successSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1000);
    } else {
      showErrorToast(result.message || i18next.t('auth.messages.loginError', 'Invalid credentials'));
    }
  } catch (error) {
    console.error('Login error:', error);
    showErrorToast(i18next.t('auth.messages.serverError', 'Server error occurred'));
  } finally {
    // Restore button state
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
    // Simulate captcha refresh by adding random query string
    const currentSrc = captchaImg.src.split('?')[0];
    captchaImg.src = `${currentSrc}?t=${Date.now()}`;

    // Add spin animation to refresh button
    const icon = refreshBtn.querySelector('i');
    if (icon) {
      icon.style.animation = 'spin 0.5s linear';
      setTimeout(() => {
        icon.style.animation = '';
      }, 500);
    }
  });
}
