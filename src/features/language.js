import { languageDirections } from "../utils/languageDirections";

export function isDirectionRTL() {
  const lang = document.documentElement.lang;
  return languageDirections.rtl.includes(lang);
}
