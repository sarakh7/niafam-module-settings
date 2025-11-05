/**
 * Comment Reply Toggle Feature
 * Handles toggling reply forms for comments with smooth animations
 */

/**
 * Initialize comment reply toggle functionality
 * - Ensures all reply forms start closed
 * - Adds click handlers to reply and cancel buttons
 */
export function initCommentReplyToggle() {
  // Ensure all reply forms start closed
  initializeReplyForms();

  // Add event listeners for reply buttons
  document.addEventListener('click', (e) => {
    // Handle reply button clicks
    if (e.target.matches('.es-replay-btn')) {
      e.preventDefault();
      handleReplyButtonClick(e.target);
    }

    // Handle cancel button clicks
    if (e.target.matches('.es-cancle-button')) {
      e.preventDefault();
      handleCancelButtonClick(e.target);
    }
  });
}

/**
 * Initialize all reply forms to closed state
 */
function initializeReplyForms() {
  const replyForms = document.querySelectorAll('.nes-form-comment-reply');
  replyForms.forEach(form => {
    form.classList.remove('es-reply-form-open', 'es-reply-form-closing');
  });
}

/**
 * Close all open reply forms with animation
 */
function closeAllReplyForms() {
  const openForms = document.querySelectorAll('.nes-form-comment-reply.es-reply-form-open');
  openForms.forEach(form => {
    closeForm(form);
  });
}

/**
 * Open a reply form with animation
 * @param {HTMLElement} form - The form element to open
 */
function openForm(form) {
  form.classList.remove('es-reply-form-closing');
  form.classList.add('es-reply-form-open');
}

/**
 * Close a reply form with animation
 * @param {HTMLElement} form - The form element to close
 */
function closeForm(form) {
  form.classList.remove('es-reply-form-open');
  form.classList.add('es-reply-form-closing');

  // Remove closing class after animation completes
  setTimeout(() => {
    form.classList.remove('es-reply-form-closing');
  }, 400); // Match the CSS transition duration
}

/**
 * Handle reply button click
 * @param {HTMLElement} button - The clicked reply button
 */
function handleReplyButtonClick(button) {
  // Get comment ID from button ID (e.g., "reply-btn-{commentid}")
  const buttonId = button.id;
  const commentId = buttonId.replace('reply-btn-', '');

  // Find the corresponding reply form
  const replyForm = document.getElementById(`reply-comment-${commentId}`);

  if (replyForm) {
    const isOpen = replyForm.classList.contains('es-reply-form-open');

    if (isOpen) {
      // Close this form
      closeForm(replyForm);
    } else {
      // Close all other forms first
      closeAllReplyForms();

      // Open this form
      openForm(replyForm);

      // Scroll to the form smoothly after a short delay to allow animation to start
      setTimeout(() => {
        replyForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);

      // Focus on first input after animation
      const firstInput = replyForm.querySelector('input, textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 450);
      }
    }
  }
}

/**
 * Handle cancel button click
 * @param {HTMLElement} button - The clicked cancel button
 */
function handleCancelButtonClick(button) {
  // Find the parent reply form
  const replyForm = button.closest('.nes-form-comment-reply');

  if (replyForm) {
    // Close the form with animation
    closeForm(replyForm);

    // Clear form fields after animation starts
    setTimeout(() => {
      const form = replyForm.querySelector('form');
      if (form) {
        form.reset();
      }
    }, 200);

    // Scroll back to the comment
    const reviewItem = replyForm.previousElementSibling;
    if (reviewItem) {
      setTimeout(() => {
        reviewItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }
}
