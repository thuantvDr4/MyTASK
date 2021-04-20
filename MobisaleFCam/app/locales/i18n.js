import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

// Import all locales
import vi from './vi';
import en from './en';
import km from './km';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  vi, en, km
};

I18n.defaultLocale = "en";
I18n.locale = "en";

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('vi') === 0 
            || currentLocale.indexOf('en') === 0 
            || currentLocale.indexOf('km') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  return I18n.t(name, params);
};

export default I18n;
