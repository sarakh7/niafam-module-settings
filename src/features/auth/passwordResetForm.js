/**
 * Password Reset Form Handler
 * Handles password recovery flow
 */

import i18next from 'i18next';
import { showInlineAlert, clearInlineAlerts } from '../common/inlineAlert';
import { validateField, clearFieldError } from './formValidation';

/**
 * Initialize password reset form
 */
export function initPasswordResetForm() {
  const form = document.getElementById('password-reset-form');
  if (!form) {
    console.warn('Password reset form not found');
    return;
  }

  // Setup captcha refresh
  // setupCaptchaRefresh('recovery-captcha-refresh', 'recovery-captcha-img');

  // Setup form submission
  form.addEventListener('submit', handlePasswordResetSubmit);

  // Setup real-time validation
  const identifierField = form.querySelector('#username_mail_mobile');
  const usernameField = form.querySelector('#username_username');

  identifierField?.addEventListener('blur', () => validateField(identifierField, 'required'));
  usernameField?.addEventListener('blur', () => validateField(usernameField, 'required'));

  identifierField?.addEventListener('input', () => clearFieldError(identifierField));
  usernameField?.addEventListener('input', () => clearFieldError(usernameField));
}

/**
 * Handle password reset form submission
 * @param {Event} e - Submit event
 */
function handlePasswordResetSubmit(e) {
  const form = e.target;

  // Clear previous alerts
  clearInlineAlerts('alerts');

  const identifierField = form.querySelector('#username_mail_mobile');
  const usernameField = form.querySelector('#username_username');

  // Validate fields
  let isValid = true;

  if (!validateField(identifierField, 'required')) {
    isValid = false;
  }

  if (!validateField(usernameField, 'required')) {
    isValid = false;
  }

  if (!isValid) {
    e.preventDefault(); // Prevent form submission
    showInlineAlert('error', i18next.t('auth.validation.fixErrors', 'Please fix the errors'), 'alerts');
    return;
  }

  // If validation passes, allow form to submit naturally
  // The form will POST to the server with espritaction=recoveryformconfirmform
  // Server will handle password reset and return the page with {error_msg} or {Recover_Password_msg}
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
//     // Refresh captcha image from server
//     captchaImg.src = `/inc/ajax.ashx?action=captcha&${Math.random()}`;

//     // Add spin animation
//     const icon = refreshBtn.querySelector('i');
//     if (icon) {
//       icon.style.animation = 'spin 0.5s linear';
//       setTimeout(() => {
//         icon.style.animation = '';
//       }, 500);
//     }
//   });
// }
