/**
 * Password Form Handler
 * Handles password change form with strength meter and show/hide toggle
 */

import i18next from 'i18next';
import { showInlineAlert, clearInlineAlerts } from '../common/inlineAlert';
import { validatePassword, showFieldError, clearFieldError } from './formValidation';

/**
 * Initialize password form
 */
export function initPasswordForm() {
  const form = document.getElementById('changePassForm');

  if (!form) {
    console.warn('Password Form: Form element not found');
    return;
  }

  // Initialize password strength meter
  initPasswordStrengthMeter();

  // Initialize password show/hide toggles
  initPasswordToggles();

  // Initialize password match validation
  initPasswordMatchValidation();

  // Handle form submission
  form.addEventListener('submit', handlePasswordFormSubmit);

  // console.log('Password Form: Initialized');
}

/**
 * Initialize password strength meter
 */
function initPasswordStrengthMeter() {
  const newPassInput = document.getElementById('newpass');
  const strengthBar = document.getElementById('password-strength-bar');

  if (!newPassInput || !strengthBar) return;

  newPassInput.addEventListener('input', () => {
    const password = newPassInput.value;

    if (!password) {
      // Reset strength meter
      strengthBar.className = 'profile-edit__password-strength-bar';
      strengthBar.style.width = '0%';
      return;
    }

    // Validate password and get strength
    const result = validatePassword(password);

    // Update strength meter
    strengthBar.className = `profile-edit__password-strength-bar profile-edit__password-strength-bar--${result.strength}`;
  });
}

/**
 * Initialize password show/hide toggles
 */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.profile-edit__password-toggle');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => handlePasswordToggle(button));
  });
}

/**
 * Handle password show/hide toggle button click
 * @param {HTMLButtonElement} button - Toggle button
 */
function handlePasswordToggle(button) {
  const targetId = button.getAttribute('data-target');
  if (!targetId) return;

  const inputField = document.getElementById(targetId);
  if (!inputField) return;

  const icon = button.querySelector('i');
  if (!icon) return;

  if (inputField.type === 'password') {
    // Show password
    inputField.type = 'text';
    icon.className = 'es esprit-eye-off';
    button.setAttribute('aria-label', 'Hide password');
  } else {
    // Hide password
    inputField.type = 'password';
    icon.className = 'es esprit-eye';
    button.setAttribute('aria-label', 'Show password');
  }
}

/**
 * Initialize password match validation
 */
function initPasswordMatchValidation() {
  const newPassInput = document.getElementById('newpass');
  const repeatPassInput = document.getElementById('newpassrepeat');

  if (!newPassInput || !repeatPassInput) return;

  // Validate on repeat password blur
  repeatPassInput.addEventListener('blur', () => {
    validatePasswordMatch(newPassInput, repeatPassInput);
  });

  // Also validate when new password changes (if repeat is already filled)
  newPassInput.addEventListener('input', () => {
    if (repeatPassInput.value !== '') {
      validatePasswordMatch(newPassInput, repeatPassInput);
    }
  });
}

/**
 * Validate that passwords match
 * @param {HTMLInputElement} newPassInput - New password input
 * @param {HTMLInputElement} repeatPassInput - Repeat password input
 * @returns {boolean} True if passwords match
 */
function validatePasswordMatch(newPassInput, repeatPassInput) {
  const newPass = newPassInput.value;
  const repeatPass = repeatPassInput.value;

  clearFieldError(repeatPassInput);

  if (repeatPass === '') {
    return true; // Empty is ok for now, will be caught by required validation
  }

  if (newPass !== repeatPass) {
    showFieldError(
      repeatPassInput,
      i18next.t('profile.validation.passwordMismatch', 'رمزهای عبور مطابقت ندارند')
    );
    return false;
  }

  return true;
}

/**
 * Handle password form submission
 * @param {Event} e - Submit event
 */
async function handlePasswordFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const messageContainer = form.querySelector('.form-message');

  // Clear previous alerts
  clearInlineAlerts('form-message');

  // Get form fields
  const oldPassInput = document.getElementById('oldpass');
  const newPassInput = document.getElementById('newpass');
  const repeatPassInput = document.getElementById('newpassrepeat');

  // Validate all fields
  let isValid = true;

  // Validate old password (required)
  clearFieldError(oldPassInput);
  if (!oldPassInput.value.trim()) {
    showFieldError(oldPassInput, i18next.t('profile.validation.required', 'این فیلد الزامی است'));
    isValid = false;
  }

  // Validate new password (required + strength)
  clearFieldError(newPassInput);
  if (!newPassInput.value.trim()) {
    showFieldError(newPassInput, i18next.t('profile.validation.required', 'این فیلد الزامی است'));
    isValid = false;
  } else {
    const passwordResult = validatePassword(newPassInput.value);
    if (!passwordResult.valid) {
      showFieldError(
        newPassInput,
        i18next.t(
          'profile.validation.weakPassword',
          'رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد'
        )
      );
      isValid = false;
    }
  }

  // Validate password match
  if (!validatePasswordMatch(newPassInput, repeatPassInput)) {
    isValid = false;
  }

  if (!isValid) {
    showInlineAlert('error', i18next.t('profile.validation.fixErrors', 'لطفا خطاهای فرم را برطرف کنید'), 'form-message');
    return;
  }

  // Collect form data
  const formData = {
    action: 'change_pass',
    oldpass: oldPassInput.value,
    newpass: newPassInput.value,
    newpassrepeat: repeatPassInput.value,
  };

  // Show loading state
  setLoadingState(submitButton, true);

  try {
    // Submit to backend
    const response = await window.submitPasswordChangeData(formData);

    if (response.status === 'success') {
      showInlineAlert(
        'success',
        i18next.t('profile.messages.passwordChangeSuccess', 'رمز عبور با موفقیت تغییر کرد'),
        'form-message'
      );

      // Clear form
      form.reset();

      // Reset strength meter
      const strengthBar = document.getElementById('password-strength-bar');
      if (strengthBar) {
        strengthBar.className = 'profile-edit__password-strength-bar';
        strengthBar.style.width = '0%';
      }

      // Clear message container
      if (messageContainer) {
        messageContainer.innerHTML = '';
      }
    } else {
      const errorMessage = response.msg || i18next.t('profile.messages.passwordChangeError', 'خطا در تغییر رمز عبور');
      showInlineAlert('error', errorMessage, 'form-message');

      if (messageContainer) {
        messageContainer.innerHTML = `<div class="alert-danger">${errorMessage}</div>`;
      }
    }
  } catch (error) {
    console.error('Password Form: Submit error', error);
    showInlineAlert('error', i18next.t('profile.messages.unknownError', 'خطای ناشناخته'), 'form-message');

    if (messageContainer) {
      messageContainer.innerHTML = `<div class="alert-danger">${i18next.t('profile.messages.unknownError', 'خطای ناشناخته')}</div>`;
    }
  } finally {
    setLoadingState(submitButton, false);
  }
}

/**
 * Set loading state on submit button
 * @param {HTMLButtonElement} button - Submit button
 * @param {boolean} loading - Whether to show loading state
 */
function setLoadingState(button, loading) {
  if (!button) return;

  if (loading) {
    button.disabled = true;
    button.classList.add('nes-btn--loading');
    button.dataset.originalContent = button.innerHTML;
    button.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span>${i18next.t('common.loading', 'در حال ارسال...')}</span>
    `;
  } else {
    button.disabled = false;
    button.classList.remove('nes-btn--loading');
    if (button.dataset.originalContent) {
      button.innerHTML = button.dataset.originalContent;
    }
  }
}
