/**
 * Avatar Upload Handler
 * Handles avatar file selection, validation, preview, and upload
 */

import i18next from 'i18next';
import { showInlineAlert, clearInlineAlerts } from '../common/inlineAlert';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

/**
 * Initialize avatar upload functionality
 */
export function initAvatarUpload() {
  const uploadButton = document.getElementById('addpicurl');
  const fileInput = document.getElementById('addpicurl-name');

  if (!uploadButton || !fileInput) {
    // console.warn('Avatar Upload: Required elements not found');
    return;
  }

  // Trigger file input when button is clicked
  uploadButton.addEventListener('click', () => {
    fileInput.click();
  });

  // Handle file selection
  fileInput.addEventListener('change', handleFileSelection);

  // console.log('Avatar Upload: Initialized');
}

/**
 * Handle file selection
 * @param {Event} e - Change event
 */
function handleFileSelection(e) {
  const fileInput = e.target;
  const file = fileInput.files[0];

  if (!file) return;

  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    showInlineAlert('error', validation.message, 'file-info');
    fileInput.value = ''; // Clear file input
    return;
  }

  // Show file info
  showFileInfo(file);

  // Preview image
  previewImage(file);

  // Upload file
  window.uploadAvatarFile(file, fileInput);
}

/**
 * Validate selected file
 * @param {File} file - Selected file
 * @returns {object} {valid: boolean, message: string}
 */
function validateFile(file) {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: i18next.t(
        'profile.validation.invalidFileType',
        'فقط فایل‌های JPG, PNG و GIF مجاز هستند'
      ),
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      message: i18next.t(
        'profile.validation.fileTooLarge',
        `حجم فایل نباید بیشتر از ${sizeMB}MB باشد`
      ),
    };
  }

  return { valid: true, message: '' };
}

/**
 * Show file information
 * @param {File} file - Selected file
 */
function showFileInfo(file) {
  const fileInfoElement = document.getElementById('file-info');
  if (!fileInfoElement) return;

  const fileSizeKB = (file.size / 1024).toFixed(2);
  const fileName = file.name;

  fileInfoElement.textContent = `${fileName} (${fileSizeKB} KB)`;
}

/**
 * Preview selected image
 * @param {File} file - Image file
 */
function previewImage(file) {
  const previewImage = document.getElementById('avatar-preview-image');
  if (!previewImage) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    previewImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

/**
 * Handle avatar upload success event from HTML script
 */
window.addEventListener('avatarUploadSuccess', (event) => {
  const data = event.detail.data;
  const $progressContainer = $('#upload-progress');
  const $messageContainer = $('.form-message');

  try {
    const response = JSON.parse(data);

    if (response.status === 'success') {
      showInlineAlert(
        'success',
        i18next.t('profile.messages.avatarUploadSuccess', 'تصویر پروفایل با موفقیت تغییر کرد'),
        'file-info'
      );

      $messageContainer.html(
        `<div class="alert-success">${i18next.t('profile.messages.avatarUploadSuccess', 'تصویر پروفایل با موفقیت تغییر کرد')}</div>`
      );

      // Hide progress bar after a delay
      setTimeout(() => {
        $progressContainer.fadeOut();
      }, 1500);
    } else {
      const errorMessage =
        response.msg ||
        i18next.t('profile.messages.avatarUploadError', 'خطا در آپلود تصویر');

      showInlineAlert('error', errorMessage, 'file-info');
      $messageContainer.html(`<div class="alert-danger">${errorMessage}</div>`);
      $progressContainer.fadeOut();
    }
  } catch (error) {
    console.error('Avatar Upload: Parse error', error);

    const errorMessage = data || i18next.t('profile.messages.unknownError', 'خطای ناشناخته');
    showInlineAlert('error', errorMessage, 'file-info');
    $messageContainer.html(`<div class="alert-danger">${errorMessage}</div>`);
    $progressContainer.fadeOut();
  }
});

/**
 * Handle avatar upload error event from HTML script
 */
window.addEventListener('avatarUploadError', (event) => {
  const error = event.detail.error;
  const $progressContainer = $('#upload-progress');
  const $messageContainer = $('.form-message');

  console.error('Avatar Upload: Upload error', error);

  const errorMessage =
    error || i18next.t('profile.messages.avatarUploadError', 'خطا در آپلود تصویر');

  showInlineAlert('error', errorMessage, 'file-info');
  $messageContainer.html(`<div class="alert-danger">${errorMessage}</div>`);
  $progressContainer.fadeOut();
});
