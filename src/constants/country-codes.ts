/**
 * CaloriTrack - Country Codes
 * Telefon numarası için ülke kodları verisi
 * Minimal. Cool. Aesthetic.
 */

export interface CountryCode {
  code: string;          // 'TR', 'US', 'DE'
  dialCode: string;      // '+90', '+1', '+49'
  name: string;          // 'Turkey', 'United States'
  nameTR: string;        // 'Türkiye', 'Amerika Birleşik Devletleri'
  flag: string;          // '🇹🇷', '🇺🇸'
  format?: string;       // '(###) ### ## ##'
  maxLength?: number;    // 10
}

export const COUNTRY_CODES: CountryCode[] = [
  // Avrupa
  { code: 'TR', dialCode: '+90', name: 'Turkey', nameTR: 'Türkiye', flag: '🇹🇷', format: '(###) ### ## ##', maxLength: 10 },
  { code: 'DE', dialCode: '+49', name: 'Germany', nameTR: 'Almanya', flag: '🇩🇪', format: '#### #######', maxLength: 11 },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', nameTR: 'Birleşik Krallık', flag: '🇬🇧', format: '#### ######', maxLength: 10 },
  { code: 'FR', dialCode: '+33', name: 'France', nameTR: 'Fransa', flag: '🇫🇷', format: '# ## ## ## ##', maxLength: 9 },
  { code: 'IT', dialCode: '+39', name: 'Italy', nameTR: 'İtalya', flag: '🇮🇹', format: '### #######', maxLength: 10 },
  { code: 'ES', dialCode: '+34', name: 'Spain', nameTR: 'İspanya', flag: '🇪🇸', format: '### ## ## ##', maxLength: 9 },
  { code: 'NL', dialCode: '+31', name: 'Netherlands', nameTR: 'Hollanda', flag: '🇳🇱', format: '## ########', maxLength: 9 },
  { code: 'BE', dialCode: '+32', name: 'Belgium', nameTR: 'Belçika', flag: '🇧🇪', format: '### ## ## ##', maxLength: 9 },
  { code: 'AT', dialCode: '+43', name: 'Austria', nameTR: 'Avusturya', flag: '🇦🇹', format: '### ### ####', maxLength: 10 },
  { code: 'CH', dialCode: '+41', name: 'Switzerland', nameTR: 'İsviçre', flag: '🇨🇭', format: '## ### ## ##', maxLength: 9 },
  { code: 'GR', dialCode: '+30', name: 'Greece', nameTR: 'Yunanistan', flag: '🇬🇷', format: '### ### ####', maxLength: 10 },
  { code: 'PT', dialCode: '+351', name: 'Portugal', nameTR: 'Portekiz', flag: '🇵🇹', format: '# ## ## ## ##', maxLength: 9 },
  { code: 'SE', dialCode: '+46', name: 'Sweden', nameTR: 'İsveç', flag: '🇸🇪', format: '## ### ## ##', maxLength: 9 },
  { code: 'NO', dialCode: '+47', name: 'Norway', nameTR: 'Norveç', flag: '🇳🇴', format: '### ## ###', maxLength: 8 },
  { code: 'DK', dialCode: '+45', name: 'Denmark', nameTR: 'Danimarka', flag: '🇩🇰', format: '## ## ## ##', maxLength: 8 },
  { code: 'FI', dialCode: '+358', name: 'Finland', nameTR: 'Finlandiya', flag: '🇫🇮', format: '## ### ####', maxLength: 9 },
  { code: 'PL', dialCode: '+48', name: 'Poland', nameTR: 'Polonya', flag: '🇵🇱', format: '### ### ###', maxLength: 9 },
  { code: 'CZ', dialCode: '+420', name: 'Czech Republic', nameTR: 'Çekya', flag: '🇨🇿', format: '### ### ###', maxLength: 9 },
  { code: 'HU', dialCode: '+36', name: 'Hungary', nameTR: 'Macaristan', flag: '🇭🇺', format: '# ### ####', maxLength: 9 },
  { code: 'RO', dialCode: '+40', name: 'Romania', nameTR: 'Romanya', flag: '🇷🇴', format: '## ### ####', maxLength: 9 },
  { code: 'BG', dialCode: '+359', name: 'Bulgaria', nameTR: 'Bulgaristan', flag: '🇧🇬', format: '### ### ###', maxLength: 9 },
  { code: 'UA', dialCode: '+380', name: 'Ukraine', nameTR: 'Ukrayna', flag: '🇺🇦', format: '## ### ## ##', maxLength: 9 },
  { code: 'RU', dialCode: '+7', name: 'Russia', nameTR: 'Rusya', flag: '🇷🇺', format: '(###) ###-##-##', maxLength: 10 },

  // Kuzey Amerika
  { code: 'US', dialCode: '+1', name: 'United States', nameTR: 'Amerika Birleşik Devletleri', flag: '🇺🇸', format: '(###) ###-####', maxLength: 10 },
  { code: 'CA', dialCode: '+1', name: 'Canada', nameTR: 'Kanada', flag: '🇨🇦', format: '(###) ###-####', maxLength: 10 },
  { code: 'MX', dialCode: '+52', name: 'Mexico', nameTR: 'Meksika', flag: '🇲🇽', format: '## #### ####', maxLength: 10 },

  // Orta Doğu
  { code: 'IL', dialCode: '+972', name: 'Israel', nameTR: 'İsrail', flag: '🇮🇱', format: '# ### ####', maxLength: 9 },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates', nameTR: 'Birleşik Arap Emirlikleri', flag: '🇦🇪', format: '## ### ####', maxLength: 9 },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', nameTR: 'Suudi Arabistan', flag: '🇸🇦', format: '# ### ####', maxLength: 9 },
  { code: 'QA', dialCode: '+974', name: 'Qatar', nameTR: 'Katar', flag: '🇶🇦', format: '## ### ####', maxLength: 8 },
  { code: 'KW', dialCode: '+965', name: 'Kuwait', nameTR: 'Kuveyt', flag: '🇰🇼', format: '#### ####', maxLength: 8 },
  { code: 'BH', dialCode: '+973', name: 'Bahrain', nameTR: 'Bahreyn', flag: '🇧🇭', format: '#### ####', maxLength: 8 },
  { code: 'OM', dialCode: '+968', name: 'Oman', nameTR: 'Umman', flag: '🇴🇲', format: '#### ####', maxLength: 8 },
  { code: 'JO', dialCode: '+962', name: 'Jordan', nameTR: 'Ürdün', flag: '🇯🇴', format: '# ### ####', maxLength: 9 },
  { code: 'LB', dialCode: '+961', name: 'Lebanon', nameTR: 'Lübnan', flag: '🇱🇧', format: '# ### ###', maxLength: 8 },
  { code: 'EG', dialCode: '+20', name: 'Egypt', nameTR: 'Mısır', flag: '🇪🇬', format: '## #### ###', maxLength: 10 },

  // Türk Cumhuriyetleri
  { code: 'AZ', dialCode: '+994', name: 'Azerbaijan', nameTR: 'Azerbaycan', flag: '🇦🇿', format: '## ### ## ##', maxLength: 9 },
  { code: 'KZ', dialCode: '+7', name: 'Kazakhstan', nameTR: 'Kazakistan', flag: '🇰🇿', format: '(###) ###-##-##', maxLength: 10 },
  { code: 'UZ', dialCode: '+998', name: 'Uzbekistan', nameTR: 'Özbekistan', flag: '🇺🇿', format: '## ### ## ##', maxLength: 9 },
  { code: 'TM', dialCode: '+993', name: 'Turkmenistan', nameTR: 'Türkmenistan', flag: '🇹🇲', format: '# ### ####', maxLength: 8 },
  { code: 'KG', dialCode: '+996', name: 'Kyrgyzstan', nameTR: 'Kırgızistan', flag: '🇰🇬', format: '### ### ###', maxLength: 9 },
  { code: 'TJ', dialCode: '+992', name: 'Tajikistan', nameTR: 'Tacikistan', flag: '🇹🇯', format: '### ### ###', maxLength: 9 },

  // Asya Pasifik
  { code: 'CN', dialCode: '+86', name: 'China', nameTR: 'Çin', flag: '🇨🇳', format: '### #### ###', maxLength: 11 },
  { code: 'JP', dialCode: '+81', name: 'Japan', nameTR: 'Japonya', flag: '🇯🇵', format: '## #### ####', maxLength: 10 },
  { code: 'KR', dialCode: '+82', name: 'South Korea', nameTR: 'Güney Kore', flag: '🇰🇷', format: '##-####-####', maxLength: 10 },
  { code: 'IN', dialCode: '+91', name: 'India', nameTR: 'Hindistan', flag: '🇮🇳', format: '##### #####', maxLength: 10 },
  { code: 'PK', dialCode: '+92', name: 'Pakistan', nameTR: 'Pakistan', flag: '🇵🇰', format: '### #######', maxLength: 10 },
  { code: 'BD', dialCode: '+880', name: 'Bangladesh', nameTR: 'Bangladeş', flag: '🇧🇩', format: '# ### ####', maxLength: 10 },
  { code: 'TH', dialCode: '+66', name: 'Thailand', nameTR: 'Tayland', flag: '🇹🇭', format: '# ### ####', maxLength: 9 },
  { code: 'VN', dialCode: '+84', name: 'Vietnam', nameTR: 'Vietnam', flag: '🇻🇳', format: '# #### ####', maxLength: 9 },
  { code: 'ID', dialCode: '+62', name: 'Indonesia', nameTR: 'Endonezya', flag: '🇮🇩', format: '### #### ###', maxLength: 11 },
  { code: 'MY', dialCode: '+60', name: 'Malaysia', nameTR: 'Malezya', flag: '🇲🇾', format: '##-#### ####', maxLength: 10 },
  { code: 'SG', dialCode: '+65', name: 'Singapore', nameTR: 'Singapur', flag: '🇸🇬', format: '#### ####', maxLength: 8 },
  { code: 'PH', dialCode: '+63', name: 'Philippines', nameTR: 'Filipinler', flag: '🇵🇭', format: '### ### ####', maxLength: 10 },
  { code: 'AU', dialCode: '+61', name: 'Australia', nameTR: 'Avustralya', flag: '🇦🇺', format: '# #### ####', maxLength: 9 },
  { code: 'NZ', dialCode: '+64', name: 'New Zealand', nameTR: 'Yeni Zelanda', flag: '🇳🇿', format: '### ### ####', maxLength: 10 },

  // Afrika
  { code: 'ZA', dialCode: '+27', name: 'South Africa', nameTR: 'Güney Afrika', flag: '🇿🇦', format: '## ### ####', maxLength: 9 },
  { code: 'NG', dialCode: '+234', name: 'Nigeria', nameTR: 'Nijerya', flag: '🇳🇬', format: '## ### ####', maxLength: 10 },
  { code: 'KE', dialCode: '+254', name: 'Kenya', nameTR: 'Kenya', flag: '🇰🇪', format: '### ### ####', maxLength: 10 },
  { code: 'MA', dialCode: '+212', name: 'Morocco', nameTR: 'Fas', flag: '🇲🇦', format: '## #### ###', maxLength: 9 },
  { code: 'TN', dialCode: '+216', name: 'Tunisia', nameTR: 'Tunus', flag: '🇹🇳', format: '## ### ###', maxLength: 8 },
  { code: 'DZ', dialCode: '+213', name: 'Algeria', nameTR: 'Cezayir', flag: '🇩🇿', format: '### ### ###', maxLength: 9 },

  // Güney Amerika
  { code: 'BR', dialCode: '+55', name: 'Brazil', nameTR: 'Brezilya', flag: '🇧🇷', format: '(##) #####-####', maxLength: 11 },
  { code: 'AR', dialCode: '+54', name: 'Argentina', nameTR: 'Arjantin', flag: '🇦🇷', format: '### ### ####', maxLength: 10 },
  { code: 'CL', dialCode: '+56', name: 'Chile', nameTR: 'Şili', flag: '🇨🇱', format: '# ### ####', maxLength: 9 },
  { code: 'CO', dialCode: '+57', name: 'Colombia', nameTR: 'Kolombiya', flag: '🇨🇴', format: '### ### ####', maxLength: 10 },
  { code: 'PE', dialCode: '+51', name: 'Peru', nameTR: 'Peru', flag: '🇵🇪', format: '### ### ###', maxLength: 9 },
  { code: 'VE', dialCode: '+58', name: 'Venezuela', nameTR: 'Venezuela', flag: '🇻🇪', format: '### ### ####', maxLength: 10 },
];
