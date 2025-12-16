/**
 * Password Reset Form Handler
 * Handles password recovery flow
 */

import i18next from 'i18next';
import { showSuccessToast, showErrorToast } from '../common/toast';
import { requestPasswordReset } from './mockAuth';
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
  setupCaptchaRefresh('reset-captcha-refresh', 'reset-captcha-img');

  // Setup form submission
  form.addEventListener('submit', handlePasswordResetSubmit);

  // Setup real-time validation
  const identifierField = form.querySelector('#reset-identifier');
  const usernameField = form.querySelector('#reset-username');

  identifierField?.addEventListener('blur', () => validateField(identifierField, 'required'));
  usernameField?.addEventListener('blur', () => validateField(usernameField, 'required'));

  identifierField?.addEventListener('input', () => clearFieldError(identifierField));
  usernameField?.addEventListener('input', () => clearFieldError(usernameField));
}

/**
 * Handle password reset form submission
 * @param {Event} e - Submit event
 */
async function handlePasswordResetSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const identifierField = form.querySelector('#reset-identifier');
  const usernameField = form.querySelector('#reset-username');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validate fields
  let isValid = true;

  if (!validateField(identifierField, 'required')) {
    isValid = false;
  }

  if (!validateField(usernameField, 'required')) {
    isValid = false;
  }

  if (!isValid) {
    showErrorToast(i18next.t('auth.validation.fixErrors', 'Please fix the errors'));
    return;
  }

  // Show loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending...</span>';

  try {
    // Mock password reset request
    const result = await requestPasswordReset(identifierField.value, usernameField.value);

    if (result.success) {
      showSuccessToast(i18next.t('auth.messages.passwordResetSent', 'Recovery code sent to your email/phone'));

      // Clear form
      form.reset();

      // Optionally scroll to confirmation section or success
      setTimeout(() => {
        const successSection = document.getElementById('success-message');
        if (successSection) {
          successSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1500);
    } else {
      showErrorToast(result.message || i18next.t('auth.messages.passwordResetError', 'Failed to send recovery code'));
    }
  } catch (error) {
    console.error('Password reset error:', error);
    showErrorToast(i18next.t('auth.messages.serverError', 'Server error occurred'));
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
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
