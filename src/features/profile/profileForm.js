/**
 * Profile Form Handler
 * Handles profile basic info form validation and submission
 */

import i18next from 'i18next';
import { showInlineAlert, clearInlineAlerts } from '../common/inlineAlert';
import { validateField, getFieldRules, clearFieldError } from './formValidation';

/**
 * Initialize profile form
 */
export function initProfileForm() {
  const form = document.getElementById('profileForm');

  if (!form) {
    // console.warn('Profile Form: Form element not found');
    return;
  }

  // Add blur validation to all form fields
  const formFields = form.querySelectorAll('.nes-input, .nes-textarea, select.nes-input');
  formFields.forEach((field) => {
    field.addEventListener('blur', () => handleFieldBlur(field));
    field.addEventListener('focus', () => clearFieldError(field));
  });

  // Handle form submission
  form.addEventListener('submit', handleFormSubmit);

  // console.log('Profile Form: Initialized');
}

/**
 * Handle field blur event for validation
 * @param {HTMLElement} field - Input field element
 */
function handleFieldBlur(field) {
  const fieldName = field.getAttribute('name');
  if (!fieldName) return;

  const rules = getFieldRules(fieldName);
  validateField(field, rules);
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const messageContainer = form.querySelector('.form-message');

  // Clear previous alerts
  clearInlineAlerts('form-message');

  // Validate all fields
  if (!validateAllFields(form)) {
    showInlineAlert('error', i18next.t('profile.validation.fixErrors', 'لطفا خطاهای فرم را برطرف کنید'), 'form-message');
    return;
  }

  // Collect form data
  const formData = collectFormData(form);

  // Show loading state
  setLoadingState(submitButton, true);

  try {
    // Submit to backend
    const response = await window.submitProfileData(formData);

    if (response.status === 'success') {
      showInlineAlert(
        'success',
        i18next.t('profile.messages.saveSuccess', 'اطلاعات با موفقیت ذخیره شد'),
        'form-message'
      );

      // Optionally clear form message
      if (messageContainer) {
        messageContainer.innerHTML = '';
      }
    } else {
      const errorMessage = response.msg || i18next.t('profile.messages.saveError', 'خطا در ذخیره اطلاعات');
      showInlineAlert('error', errorMessage, 'form-message');

      if (messageContainer) {
        messageContainer.innerHTML = `<div class="alert-danger">${errorMessage}</div>`;
      }
    }
  } catch (error) {
    console.error('Profile Form: Submit error', error);
    showInlineAlert('error', i18next.t('profile.messages.unknownError', 'خطای ناشناخته'), 'form-message');

    if (messageContainer) {
      messageContainer.innerHTML = `<div class="alert-danger">${i18next.t('profile.messages.unknownError', 'خطای ناشناخته')}</div>`;
    }
  } finally {
    setLoadingState(submitButton, false);
  }
}

/**
 * Validate all form fields
 * @param {HTMLFormElement} form - Form element
 * @returns {boolean} True if all fields are valid
 */
function validateAllFields(form) {
  let isValid = true;

  const fields = form.querySelectorAll('.nes-input, .nes-textarea, select.nes-input');
  fields.forEach((field) => {
    const fieldName = field.getAttribute('name');
    if (!fieldName || fieldName === 'action') return; // Skip hidden fields

    const rules = getFieldRules(fieldName);
    const fieldValid = validateField(field, rules);

    if (!fieldValid) {
      isValid = false;
    }
  });

  return isValid;
}

/**
 * Collect all form data
 * @param {HTMLFormElement} form - Form element
 * @returns {object} Form data as key-value pairs
 */
function collectFormData(form) {
  const formData = {
    action: 'save_profile_user',
  };

  const fields = form.querySelectorAll('input, textarea, select');
  fields.forEach((field) => {
    const name = field.getAttribute('name');
    if (name && name !== 'action') {
      formData[name] = field.value;
    }
  });

  return formData;
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

    // Save original content
    button.dataset.originalContent = button.innerHTML;

    // Show loading state
    button.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span>${i18next.t('common.loading', 'در حال ارسال...')}</span>
    `;
  } else {
    button.disabled = false;
    button.classList.remove('nes-btn--loading');

    // Restore original content
    if (button.dataset.originalContent) {
      button.innerHTML = button.dataset.originalContent;
    }
  }
}
