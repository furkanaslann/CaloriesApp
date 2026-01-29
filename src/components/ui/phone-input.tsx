/**
 * CaloriTrack - Phone Input Component
 * Ülke kodu seçimli telefon inputu
 * Minimal. Cool. Aesthetic.
 */

import { LightTheme } from "@/constants";
import { COUNTRY_CODES } from "@/constants/country-codes";
import { PhoneInputProps } from "@/types/ui";
import { formatPhoneNumber, getCountryByCode, getPhonePlaceholder } from "@/utils/phone-format";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { CountryCodeModal } from "./country-code-modal";

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  label,
  placeholder,
  defaultCountry = "TR",
  disabled = false,
  containerStyle,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  // Ülke bilgisi
  const country =
    getCountryByCode(value.countryCode) || getCountryByCode(defaultCountry);

  // Display value - her zaman parent value'dan al, editingValue sadece internal state
  // Focus'ta bile direkt parent value'yu kullan, bu race condition'ı önler
  const displayValue = useMemo(() => {
    return formatPhoneNumber(value.phoneNumber, value.countryCode);
  }, [value.phoneNumber, value.countryCode]);

  // Ülke kodu butonuna basıldığında
  const handleCountryPress = useCallback(() => {
    if (disabled) return;
    setIsModalVisible(true);
    // Modal açıldığında focus'u kaybet ki formatlansın
    textInputRef.current?.blur();
  }, [disabled]);

  // Ülke seçildiğinde
  const handleSelectCountry = useCallback((selectedCountry: (typeof COUNTRY_CODES)[0]) => {
    onChange({
      countryCode: selectedCountry.code,
      dialCode: selectedCountry.dialCode,
      phoneNumber: value.phoneNumber,
    });
  }, [onChange, value.phoneNumber]);

  // Focus olayı - sadece state güncelle, cursor positioning yok
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Blur olayı - focus state'ini güncelle
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Telefon girişi değiştiğinde
  const handlePhoneChange = useCallback((text: string) => {
    // Sadece rakamları al
    const digits = text.replace(/\D/g, "");

    // Max length kontrolü
    if (country?.maxLength && digits.length > country.maxLength) {
      return;
    }

    // Parent'ı güncelle (raw digits ile)
    onChange({
      ...value,
      phoneNumber: digits,
    });
  }, [country?.maxLength, value.countryCode, value, onChange]);

  // Focus styles - useCallback ile stabilize edildi
  const getInputGroupStyle = useCallback((): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.inputGroup,
    };

    if (error) {
      baseStyle.borderColor = LightTheme.colors.error;
      baseStyle.borderWidth = 2;
    } else if (isFocused) {
      baseStyle.borderColor = LightTheme.colors.primary;
      baseStyle.borderWidth = 2;
      baseStyle.shadowColor = LightTheme.colors.primary;
      baseStyle.shadowOffset = { width: 0, height: 4 };
      baseStyle.shadowOpacity = 0.3;
      baseStyle.shadowRadius = 8;
      baseStyle.elevation = 8;
    } else {
      baseStyle.borderColor = LightTheme.semanticColors.border.primary;
      baseStyle.borderWidth = 1;
    }

    if (disabled) {
      baseStyle.backgroundColor =
        LightTheme.semanticColors.background.secondary;
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  }, [error, isFocused, disabled]);

  const getLabelStyle = useCallback((): TextStyle => ({
    ...styles.label,
    color: error
      ? LightTheme.colors.error
      : LightTheme.semanticColors.text.primary,
  }), [error]);

  const getErrorStyle = useCallback((): TextStyle => ({
    ...styles.errorText,
    color: LightTheme.colors.error,
  }), []);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}

      <View style={getInputGroupStyle()}>
        {/* Ülke Kodu Butonu */}
        <TouchableOpacity
          style={styles.countryButton}
          onPress={handleCountryPress}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={styles.flag}>{country?.flag || "🌍"}</Text>
          <Text style={styles.dialCode}>{country?.dialCode || "+90"}</Text>
          {!disabled && (
            <Ionicons
              name="chevron-down"
              size={16}
              color={LightTheme.semanticColors.text.secondary}
            />
          )}
        </TouchableOpacity>

        {/* Ayrıcı */}
        <View style={styles.separator} />

        {/* Telefon Inputu */}
        <TextInput
          ref={textInputRef}
          style={styles.phoneInput}
          placeholder={placeholder || getPhonePlaceholder(value.countryCode)}
          placeholderTextColor={LightTheme.semanticColors.text.tertiary}
          value={displayValue}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
        />

        {/* İkon (error veya success durumunda) */}
        {error && (
          <Ionicons
            name="alert-circle"
            size={20}
            color={LightTheme.colors.error}
            style={styles.statusIcon}
          />
        )}
      </View>

      {error && <Text style={getErrorStyle()}>{error}</Text>}

      {/* Country Code Modal */}
      <CountryCodeModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectCountry={handleSelectCountry}
        selectedCountryCode={value.countryCode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: LightTheme.spacing.lg,
  },
  label: {
    fontSize: LightTheme.typography.base.fontSize,
    fontWeight: "500",
    marginBottom: LightTheme.spacing.sm,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LightTheme.semanticColors.background.primary,
    borderRadius: LightTheme.borderRadius.lg,
    paddingHorizontal: LightTheme.spacing.md,
    minHeight: 52,
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: LightTheme.spacing.xs,
    paddingRight: LightTheme.spacing.md,
    paddingVertical: LightTheme.spacing.sm,
    minHeight: 44,
  },
  flag: {
    fontSize: 20,
  },
  dialCode: {
    fontSize: LightTheme.typography.base.fontSize,
    fontWeight: "500",
    color: LightTheme.semanticColors.text.primary,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: LightTheme.semanticColors.border.primary,
    marginRight: LightTheme.spacing.md,
  },
  phoneInput: {
    flex: 1,
    fontSize: LightTheme.typography.base.fontSize,
    color: LightTheme.semanticColors.text.primary,
    paddingVertical: LightTheme.spacing.sm,
    paddingHorizontal: 0,
    minHeight: 44,
  },
  statusIcon: {
    marginLeft: LightTheme.spacing.sm,
  },
  errorText: {
    fontSize: LightTheme.typography.sm.fontSize,
    marginTop: LightTheme.spacing.xs,
  },
});

export default PhoneInput;
