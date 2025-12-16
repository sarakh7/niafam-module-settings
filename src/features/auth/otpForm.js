/**
 * OTP Login Form Handler
 * Handles multi-step OTP login flow
 */

import i18next from 'i18next';
import { showSuccessToast, showErrorToast } from '../common/toast';
import { sendOTP, verifyOTP } from './mockAuth';
import { validateField, clearFieldError } from './formValidation';

let otpTimer = null;
let otpCountdown = 120;

/**
 * Initialize OTP login form
 */
export function initOTPForm() {
  const step1 = document.getElementById('otp-step-1');
  const step2 = document.getElementById('otp-step-2');

  if (!step1 || !step2) {
    console.warn('OTP form steps not found');
    return;
  }

  // Setup captcha refresh
  setupCaptchaRefresh('otp-captcha-refresh', 'otp-captcha-img');

  // Setup phone form submission (Step 1)
  const phoneForm = document.getElementById('otp-phone-form');
  phoneForm?.addEventListener('submit', handlePhoneSubmit);

  // Setup verify form submission (Step 2)
  const verifyForm = document.getElementById('otp-verify-form');
  verifyForm?.addEventListener('submit', handleVerifySubmit);

  // Setup back button
  const backBtn = document.getElementById('otp-back-btn');
  backBtn?.addEventListener('click', () => goToStep(1));

  // Setup resend button
  const resendBtn = document.getElementById('otp-resend-btn');
  resendBtn?.addEventListener('click', handleResendOTP);

  // Setup real-time validation
  const usernameField = document.getElementById('otp-username');
  const phoneField = document.getElementById('otp-phone');

  usernameField?.addEventListener('input', () => clearFieldError(usernameField));
  phoneField?.addEventListener('input', () => clearFieldError(phoneField));
}

/**
 * Handle phone form submission (Step 1)
 * @param {Event} e - Submit event
 */
async function handlePhoneSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const usernameField = form.querySelector('#otp-username');
  const phoneField = form.querySelector('#otp-phone');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validate fields
  let isValid = true;

  if (!validateField(usernameField, 'required')) {
    isValid = false;
  }

  if (!validateField(phoneField, 'phone')) {
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
    // Mock send OTP
    const result = await sendOTP(usernameField.value, phoneField.value);

    if (result.success) {
      showSuccessToast(i18next.t('auth.messages.otpSent', 'Verification code sent!'));

      // Move to step 2
      goToStep(2);

      // Start countdown timer
      startOTPTimer();
    } else {
      showErrorToast(result.message || i18next.t('auth.messages.otpError', 'Failed to send code'));
    }
  } catch (error) {
    console.error('OTP send error:', error);
    showErrorToast(i18next.t('auth.messages.serverError', 'Server error occurred'));
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

/**
 * Handle verify form submission (Step 2)
 * @param {Event} e - Submit event
 */
async function handleVerifySubmit(e) {
  e.preventDefault();

  const form = e.target;
  const codeField = form.querySelector('#otp-code');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validate code
  if (!validateField(codeField, 'otp')) {
    showErrorToast(i18next.t('auth.validation.invalidOTP', 'Code must be 6 digits'));
    return;
  }

  // Show loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Verifying...</span>';

  try {
    // Mock verify OTP
    const result = await verifyOTP(codeField.value);

    if (result.success) {
      showSuccessToast(i18next.t('auth.messages.otpSuccess', 'Login successful!'));

      // Stop timer
      stopOTPTimer();

      // Scroll to success section
      setTimeout(() => {
        const successSection = document.getElementById('success-message');
        if (successSection) {
          successSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1000);
    } else {
      showErrorToast(result.message || i18next.t('auth.messages.otpInvalid', 'Invalid code'));
    }
  } catch (error) {
    console.error('OTP verify error:', error);
    showErrorToast(i18next.t('auth.messages.serverError', 'Server error occurred'));
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

/**
 * Handle resend OTP
 */
async function handleResendOTP() {
  const usernameField = document.getElementById('otp-username');
  const phoneField = document.getElementById('otp-phone');

  if (!usernameField || !phoneField) return;

  try {
    const result = await sendOTP(usernameField.value, phoneField.value);

    if (result.success) {
      showSuccessToast(i18next.t('auth.messages.otpResent', 'Code resent!'));
      startOTPTimer();
    } else {
      showErrorToast(result.message || i18next.t('auth.messages.otpError', 'Failed to send code'));
    }
  } catch (error) {
    console.error('OTP resend error:', error);
    showErrorToast(i18next.t('auth.messages.serverError', 'Server error occurred'));
  }
}

/**
 * Go to specific OTP step
 * @param {number} step - Step number (1 or 2)
 */
function goToStep(step) {
  const step1 = document.getElementById('otp-step-1');
  const step2 = document.getElementById('otp-step-2');
  const stepIndicators = document.querySelectorAll('.auth-otp__step');

  if (step === 1) {
    step1.classList.remove('d-none');
    step2.classList.add('d-none');

    // Update step indicators
    stepIndicators[0]?.classList.add('auth-otp__step--active');
    stepIndicators[0]?.classList.remove('auth-otp__step--completed');
    stepIndicators[1]?.classList.remove('auth-otp__step--active');
    stepIndicators[1]?.classList.remove('auth-otp__step--completed');

    // Stop timer
    stopOTPTimer();
  } else if (step === 2) {
    step1.classList.add('d-none');
    step2.classList.remove('d-none');

    // Update step indicators
    stepIndicators[0]?.classList.remove('auth-otp__step--active');
    stepIndicators[0]?.classList.add('auth-otp__step--completed');
    stepIndicators[1]?.classList.add('auth-otp__step--active');

    // Focus on code input
    const codeField = document.getElementById('otp-code');
    setTimeout(() => codeField?.focus(), 100);
  }
}

/**
 * Start OTP countdown timer
 */
function startOTPTimer() {
  otpCountdown = 120; // 2 minutes
  const timerText = document.getElementById('otp-timer-text');
  const resendBtn = document.getElementById('otp-resend-btn');

  // Show timer, hide resend button
  timerText?.classList.remove('d-none');
  resendBtn?.classList.add('d-none');

  otpTimer = setInterval(() => {
    otpCountdown--;

    if (otpCountdown <= 0) {
      stopOTPTimer();

      // Show resend button, hide timer
      timerText?.classList.add('d-none');
      resendBtn?.classList.remove('d-none');
    } else {
      // Update timer text
      const minutes = Math.floor(otpCountdown / 60);
      const seconds = otpCountdown % 60;
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      if (timerText) {
        const template = i18next.t('auth.otp.resendIn', 'Resend in {{time}}');
        timerText.textContent = template.replace('{{time}}', timeString);
      }
    }
  }, 1000);
}

/**
 * Stop OTP countdown timer
 */
function stopOTPTimer() {
  if (otpTimer) {
    clearInterval(otpTimer);
    otpTimer = null;
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
