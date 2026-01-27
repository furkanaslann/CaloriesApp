/**
 * CaloriTrack - Country Code Modal
 * Ülke kodu seçim modalı
 * Minimal. Cool. Aesthetic.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightTheme } from '@/constants';
import { COUNTRY_CODES, type CountryCode } from '@/constants/country-codes';

export interface CountryCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCountry: (country: CountryCode) => void;
  selectedCountryCode?: string;
}

export const CountryCodeModal: React.FC<CountryCodeModalProps> = ({
  visible,
  onClose,
  onSelectCountry,
  selectedCountryCode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Ülke listesini filtrele
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return COUNTRY_CODES;
    }

    const query = searchQuery.toLowerCase();
    return COUNTRY_CODES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.nameTR.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.dialCode.includes(query)
    );
  }, [searchQuery]);

  const handleSelectCountry = (country: CountryCode) => {
    onSelectCountry(country);
    onClose();
    setSearchQuery(''); // Reset search
  };

  const handleClose = () => {
    onClose();
    setSearchQuery(''); // Reset search
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Ülke Seç</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={18} color={LightTheme.semanticColors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={LightTheme.semanticColors.text.tertiary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Ülke ara..."
              placeholderTextColor={LightTheme.semanticColors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={LightTheme.semanticColors.text.tertiary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Country List */}
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filteredCountries.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={LightTheme.semanticColors.text.tertiary}
                />
                <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
              </View>
            ) : (
              filteredCountries.map((country) => (
                <CountryListItem
                  key={country.code}
                  country={country}
                  isSelected={country.code === selectedCountryCode}
                  onPress={() => handleSelectCountry(country)}
                />
              ))
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

interface CountryListItemProps {
  country: CountryCode;
  isSelected: boolean;
  onPress: () => void;
}

const CountryListItem: React.FC<CountryListItemProps> = ({
  country,
  isSelected,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.countryItem, isSelected && styles.countryItemSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.flag}>{country.flag}</Text>
    <View style={styles.countryInfo}>
      <Text style={[styles.countryName, isSelected && styles.countryNameSelected]}>
        {country.nameTR}
      </Text>
      <Text style={styles.countryNameEn}>{country.name}</Text>
    </View>
    <Text style={[styles.dialCode, isSelected && styles.dialCodeSelected]}>
      {country.dialCode}
    </Text>
    {isSelected && (
      <Ionicons
        name="checkmark-circle"
        size={22}
        color={LightTheme.colors.primary}
        style={styles.checkIcon}
      />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: LightTheme.semanticColors.background.primary,
    borderTopLeftRadius: LightTheme.borderRadius.xl,
    borderTopRightRadius: LightTheme.borderRadius.xl,
    paddingBottom: 34,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LightTheme.spacing['2xl'],
    paddingTop: LightTheme.spacing.xl,
    paddingBottom: LightTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: LightTheme.semanticColors.border.secondary,
  },
  title: {
    fontSize: LightTheme.typography.xl.fontSize,
    fontWeight: '700',
    color: LightTheme.semanticColors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LightTheme.semanticColors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: LightTheme.spacing['2xl'],
    marginTop: LightTheme.spacing.lg,
    marginBottom: LightTheme.spacing.md,
    backgroundColor: LightTheme.semanticColors.background.secondary,
    borderWidth: 1,
    borderColor: LightTheme.semanticColors.border.primary,
    borderRadius: LightTheme.borderRadius.lg,
    paddingHorizontal: LightTheme.spacing.md,
  },
  searchIcon: {
    marginRight: LightTheme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: LightTheme.typography.base.fontSize,
    color: LightTheme.semanticColors.text.primary,
    paddingVertical: LightTheme.spacing.sm,
  },
  clearButton: {
    padding: LightTheme.spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: LightTheme.spacing['2xl'],
    paddingTop: LightTheme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: LightTheme.spacing['4xl'],
  },
  emptyText: {
    marginTop: LightTheme.spacing.md,
    fontSize: LightTheme.typography.base.fontSize,
    color: LightTheme.semanticColors.text.secondary,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: LightTheme.spacing.md,
    paddingHorizontal: LightTheme.spacing.md,
    backgroundColor: LightTheme.semanticColors.background.secondary,
    borderRadius: LightTheme.borderRadius.lg,
    marginBottom: LightTheme.spacing.sm,
  },
  countryItemSelected: {
    backgroundColor: `${LightTheme.colors.primary}10`,
    borderWidth: 1,
    borderColor: LightTheme.colors.primary,
  },
  flag: {
    fontSize: 24,
    marginRight: LightTheme.spacing.md,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: LightTheme.typography.base.fontSize,
    fontWeight: '600',
    color: LightTheme.semanticColors.text.primary,
  },
  countryNameSelected: {
    color: LightTheme.colors.primary,
  },
  countryNameEn: {
    fontSize: LightTheme.typography.sm.fontSize,
    color: LightTheme.semanticColors.text.secondary,
    marginTop: 2,
  },
  dialCode: {
    fontSize: LightTheme.typography.sm.fontSize,
    fontWeight: '500',
    color: LightTheme.semanticColors.text.secondary,
    marginRight: LightTheme.spacing.sm,
  },
  dialCodeSelected: {
    color: LightTheme.colors.primary,
  },
  checkIcon: {
    marginLeft: LightTheme.spacing.sm,
  },
});

export default CountryCodeModal;
