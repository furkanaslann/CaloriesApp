/**
 * CaloriTrack - Phone Format Utility
 * Telefon numarası formatlama ve validasyon
 * Minimal. Cool. Aesthetic.
 */

import { COUNTRY_CODES, CountryCode } from '@/constants/country-codes';

/**
 * Ülke koduna göre ülke bilgisi getirir
 */
export const getCountryByCode = (code: string): CountryCode | undefined => {
  return COUNTRY_CODES.find(c => c.code === code);
};

/**
 * Dial code'a göre ülke bilgisi getirir
 */
export const getCountryByDialCode = (dialCode: string): CountryCode | undefined => {
  return COUNTRY_CODES.find(c => c.dialCode === dialCode);
};

/**
 * Telefon numarasını ülkeye göre formatlar
 * Format pattern'daki # karakterlerini kullanıcı girişi ile değiştirir
 *
 * Örnek format: '(###) ### ## ##'
 * Input: '5551234567'
 * Output: '(555) 123 45 67'
 */
export const formatPhoneNumber = (input: string, countryCode: string): string => {
  const country = getCountryByCode(countryCode);

  // Eğer ülke bulunamazsa veya format tanımlı değilse, raw input'u döndür
  if (!country?.format) {
    return input;
  }

  // Sadece rakamları al
  const digits = input.replace(/\D/g, '');

  // Max length kontrolü
  if (country.maxLength && digits.length > country.maxLength) {
    return digits.substring(0, country.maxLength);
  }

  // Format pattern'i uygula
  let result = country.format;
  let digitIndex = 0;

  for (let i = 0; i < result.length && digitIndex < digits.length; i++) {
    if (result[i] === '#') {
      result = result.substring(0, i) + digits[digitIndex] + result.substring(i + 1);
      digitIndex++;
    }
  }

  // Kullanılmayan # karakterlerini temizle
  const firstUnusedHash = result.indexOf('#');
  if (firstUnusedHash !== -1) {
    result = result.substring(0, firstUnusedHash);
  }

  return result;
};

/**
 * Formatlı telefon numarasından sadece rakamları çıkarır
 */
export const stripPhoneFormatting = (formattedPhone: string): string => {
  return formattedPhone.replace(/\D/g, '');
};

/**
 * Telefon numarasının geçerliliğini kontrol eder
 *
 * @param phoneNumber - Formatlanmış veya formatlanmamış telefon numarası
 * @param countryCode - Ülke kodu (örn: 'TR', 'US')
 * @returns { isValid: boolean, error?: string }
 */
export const validatePhoneNumber = (
  phoneNumber: string,
  countryCode: string
): { isValid: boolean; error?: string } => {
  const country = getCountryByCode(countryCode);

  // Sadece rakamları al
  const digits = phoneNumber.replace(/\D/g, '');

  // Minimum uzunluk kontrolü (ülkeye göre)
  const minMinLength = country?.maxLength ? Math.min(7, country.maxLength) : 7;

  if (digits.length === 0) {
    // Telefon numarası isteğe bağlı olduğu için boş geçilebilir
    return { isValid: true };
  }

  if (digits.length < minMinLength) {
    return {
      isValid: false,
      error: `Telefon numarası en az ${minMinLength} haneli olmalıdır.`,
    };
  }

  // Maximum uzunluk kontrolü
  if (country?.maxLength && digits.length > country.maxLength) {
    return {
      isValid: false,
      error: `Telefon numarası ${country.maxLength} haneyi geçemez.`,
    };
  }

  // Sadece rakam kontrolü (zaten \D ile filtreliyoruz ama ek güvenlik)
  if (!/^\d+$/.test(digits)) {
    return {
      isValid: false,
      error: 'Telefon numarası sadece rakamlardan oluşmalıdır.',
    };
  }

  return { isValid: true };
};

/**
 * Formatlı telefon numarasını uluslararası formata dönüştürür
 * Örnek: '+90 555 123 45 67'
 */
export const toInternationalFormat = (
  phoneNumber: string,
  countryCode: string
): string => {
  const country = getCountryByCode(countryCode);
  if (!country) return phoneNumber;

  const digits = phoneNumber.replace(/\D/g, '');
  const formatted = formatPhoneNumber(digits, countryCode);

  return `${country.dialCode} ${formatted}`;
};

/**
 * Placeholder text'i ülkeye göre oluşturur
 * Örnek: '555 123 45 67' (Türkiye için)
 */
export const getPhonePlaceholder = (countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  if (!country?.format) return '555 123 45 67';

  // Format pattern'i örnek rakamlarla doldur
  return country.format.replace(/#/g, '5');
};

/**
 * Kullanıcının girdiği telefon numarasını formatlar
 * Kullanıcı her rakam girdiğinde çağrılır
 */
export const handlePhoneInput = (
  input: string,
  currentFormatted: string,
  countryCode: string
): string => {
  // Silme işlemi mi?
  const isDeleting = input.length < currentFormatted.replace(/\D/g, '').length;

  if (isDeleting) {
    // Silme işlemi için basit mantık
    const digits = input.replace(/\D/g, '');
    return formatPhoneNumber(digits, countryCode);
  }

  // Ekleme işlemi
  const digits = input.replace(/\D/g, '');
  return formatPhoneNumber(digits, countryCode);
};
