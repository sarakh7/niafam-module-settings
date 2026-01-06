/**
 * OTP Login Form Handler
 * Handles multi-step OTP login flow
 */

import i18next from 'i18next';
import { showInlineAlert, clearInlineAlerts } from '../common/inlineAlert';
import { validateField, clearFieldError } from './formValidation';

let otpTimer = null;
let otpCountdown = 120;
let serverTimerValue = 120;

/**
 * Reset captcha after form submission
 */
function resetCaptcha() {
  // Reset reCAPTCHA if available
  if (typeof grecaptcha !== 'undefined') {
    grecaptcha.reset();
  }

  // Clear g-recaptcha-response hidden field
  const captchaField = document.getElementById('g-recaptcha-response');
  if (captchaField) {
    captchaField.value = '';
  }

  // Refresh custom captcha image if exists
  const captchaImg = document.getElementById('otp-captcha-img');
  if (captchaImg) {
    captchaImg.src = `/inc/ajax.ashx?action=captcha&${Math.random()}`;
  }
}

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

  // Get captcha value
  const captcha = document.getElementById('g-recaptcha-response')?.value || document.getElementById('otp-captcha')?.value || '';

  // Validate fields
  let isValid = true;

  if (!validateField(usernameField, 'required')) {
    isValid = false;
  }

  if (!validateField(phoneField, 'phone')) {
    isValid = false;
  }

  // Validate captcha
  if (!captcha) {
    showInlineAlert('error', 'Please confirm you are not a robot.', 'alerts');
    return;
  }

  if (!isValid) {
    showInlineAlert('error', i18next.t('auth.validation.fixErrors', 'Please fix the errors'), 'alerts');
    return;
  }

  // Clear previous alerts
  clearInlineAlerts('alerts');

  // Show loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending...</span>';

  try {
    // Real API call to send OTP
    const result = await window.sendOTPCode({
      action: 'send_otp',
      phone: phoneField.value.trim(),
      username: usernameField.value.trim(),
      'g-recaptcha-response': captcha
    });

    if (result.status === 'success') {
      // Extract timer value from server
      serverTimerValue = result.time || 120;

      showInlineAlert('success', result.msg || i18next.t('auth.messages.otpSent', 'Verification code sent!'), 'alerts');

      // Move to step 2
      goToStep(2);

      // Start countdown timer with server value
      startOTPTimer();

      // Reset captcha
      resetCaptcha();
    } else {
      // Clean quotes from error message
      let errorMsg = result.msg || i18next.t('auth.messages.otpError', 'Failed to send code');
      errorMsg = errorMsg.replace(/^"(.*)"$/, '$1');

      // Handle specific error messages
      if (errorMsg === 'User not found!') {
        errorMsg = 'نام کاربری وجود ندارد!';
      }

      showInlineAlert('error', errorMsg, 'alerts');

      // Reset captcha
      resetCaptcha();
    }
  } catch (error) {
    console.error('OTP send error:', error);
    showInlineAlert('error', i18next.t('auth.messages.serverError', 'Server error occurred'), 'alerts');

    // Reset captcha on error
    resetCaptcha();
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
    showInlineAlert('error', i18next.t('auth.validation.invalidOTP', 'Code must be 6 digits'), 'alerts');
    return;
  }

  // Clear previous alerts
  clearInlineAlerts('alerts');

  // Show loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Verifying...</span>';

  try {
    // Real API call to verify OTP
    const result = await window.verifyOTPCode({
      action: 'verify_otp',
      otp: codeField.value.trim()
    });

    if (result.status === 'success') {
      showInlineAlert('success', result.msg || i18next.t('auth.messages.otpSuccess', 'Login successful!'), 'alerts');

      // Stop timer
      stopOTPTimer();

      // Reload page after 2 seconds
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      // Clean quotes from error message
      let errorMsg = result.msg || i18next.t('auth.messages.otpInvalid', 'Invalid code');
      errorMsg = errorMsg.replace(/^"(.*)"$/, '$1');

      showInlineAlert('error', errorMsg, 'alerts');
    }
  } catch (error) {
    console.error('OTP verify error:', error);
    showInlineAlert('error', i18next.t('auth.messages.serverError', 'Server error occurred'), 'alerts');
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
  const resendBtn = document.getElementById('otp-resend-btn');

  if (!usernameField || !phoneField) return;

  // Disable resend button
  if (resendBtn) {
    resendBtn.disabled = true;
  }

  // Clear previous alerts
  clearInlineAlerts('alerts');

  try {
    // Real API call to resend OTP
    const result = await window.resendOTPCode({
      action: 'resend_otp',
      phone: phoneField.value.trim()
    });

    if (result.status === 'success') {
      // Extract new timer value from server
      serverTimerValue = result.time || 120;

      showInlineAlert('success', result.msg || i18next.t('auth.messages.otpResent', 'Code resent!'), 'alerts');

      // Restart timer with new server value
      startOTPTimer();
    } else {
      // Clean quotes from error message
      let errorMsg = result.msg || i18next.t('auth.messages.otpError', 'Failed to send code');
      errorMsg = errorMsg.replace(/^"(.*)"$/, '$1');

      showInlineAlert('error', errorMsg, 'alerts');

      // Re-enable resend button on error
      if (resendBtn) {
        resendBtn.disabled = false;
      }
    }
  } catch (error) {
    console.error('OTP resend error:', error);
    showInlineAlert('error', i18next.t('auth.messages.serverError', 'Server error occurred'), 'alerts');

    // Re-enable resend button on error
    if (resendBtn) {
      resendBtn.disabled = false;
    }
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

    // Clear alerts when going back
    clearInlineAlerts('alerts');

    // Reset captcha when going back to step 1
    resetCaptcha();
  } else if (step === 2) {
    step1.classList.add('d-none');
    step2.classList.remove('d-none');

    // Update step indicators
    stepIndicators[0]?.classList.remove('auth-otp__step--active');
    stepIndicators[0]?.classList.add('auth-otp__step--completed');
    stepIndicators[1]?.classList.add('auth-otp__step--active');

    // Clear alerts when moving to step 2
    clearInlineAlerts('alerts');

    // Focus on code input
    const codeField = document.getElementById('otp-code');
    setTimeout(() => codeField?.focus(), 100);
  }
}

/**
 * Start OTP countdown timer
 */
function startOTPTimer() {
  otpCountdown = serverTimerValue; // Use server-provided timer value
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

