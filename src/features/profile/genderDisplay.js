/**
 * Gender Display Handler
 * Automatically translates gender values based on data-gender attribute
 */
import i18next from 'i18next';

/**
 * Get i18n key for gender value
 * @param {string|number} genderValue - Gender value (1=woman, 2=man, other=other)
 * @returns {string} i18n key for the gender
 */
function getGenderI18nKey(genderValue) {
  const value = String(genderValue).trim();

  switch (value) {
    case '1':
      return 'profile.form.genderWoman';
    case '2':
      return 'profile.form.genderMan';
    case '':
    case '0':
      return 'profile.form.genderNone';
    default:
      return 'profile.form.genderOther';
  }
}

/**
 * Update gender display elements with translated text
 */
function updateGenderDisplays() {
  const genderDisplays = document.querySelectorAll('[data-gender]');

  genderDisplays.forEach((element) => {
    const genderValue = element.getAttribute('data-gender');

    // Only update elements that are meant for display (not form inputs)
    if (element.classList.contains('profile-details__gender-display')) {
      const i18nKey = getGenderI18nKey(genderValue);
      const translatedText = i18next.t(i18nKey);
      element.textContent = translatedText;
    }
  });
}

/**
 * Initialize gender display translation
 */
export function initGenderDisplay() {
  // Initial update
  updateGenderDisplays();

  // Update when language changes
  i18next.on('languageChanged', () => {
    updateGenderDisplays();
  });
}
