/**
 * Login Form Handler
 * Handles login form submission and validation
 */

import i18next from 'i18next';
import { showInlineAlert, clearInlineAlerts } from '../common/inlineAlert';
import { validateField, clearFieldError } from './formValidation';

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
  // setupCaptchaRefresh('login-captcha-refresh', 'login-captcha-img');

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
function handleLoginSubmit(e) {
  const form = e.target;

  // Clear previous alerts
  clearInlineAlerts('alerts');

  const usernameField = form.querySelector('#login-username');
  const passwordField = form.querySelector('#login-password');

  // Validate fields
  let isValid = true;

  if (!validateField(usernameField, 'required')) {
    isValid = false;
  }

  if (!validateField(passwordField, 'required')) {
    isValid = false;
  }

  if (!isValid) {
    e.preventDefault(); // Prevent form submission
    showInlineAlert('error', i18next.t('auth.validation.fixErrors', 'Please fix the errors'), 'alerts');
    return;
  }

  // If validation passes, allow form to submit naturally
  // The form will POST to the server with espritaction=login
  // Server will handle authentication and return the page with success/error messages
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
// function setupCaptchaRefresh(refreshBtnId, captchaImgId) {
//   const refreshBtn = document.getElementById(refreshBtnId);
//   const captchaImg = document.getElementById(captchaImgId);

//   if (!refreshBtn || !captchaImg) return;

//   refreshBtn.addEventListener('click', () => {
//     // Simulate captcha refresh by adding random query string
//     const currentSrc = captchaImg.src.split('?')[0];
//     captchaImg.src = `${currentSrc}?t=${Date.now()}`;

//     // Add spin animation to refresh button
//     const icon = refreshBtn.querySelector('i');
//     if (icon) {
//       icon.style.animation = 'spin 0.5s linear';
//       setTimeout(() => {
//         icon.style.animation = '';
//       }, 500);
//     }
//   });
// }
