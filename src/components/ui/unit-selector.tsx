/**
 * CaloriTrack - Unit Selector Component
 * Minimal. Cool. Aesthetic.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LightTheme } from '@/constants';

interface UnitSelectorProps {
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({
  options,
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.button,
            selected === option.value && styles.buttonSelected,
          ]}
          onPress={() => onSelect(option.value)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.text,
              selected === option.value && styles.textSelected,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 60,
    alignItems: 'center',
    ...LightTheme.shadows.sm,
  },
  buttonSelected: {
    backgroundColor: LightTheme.colors.primary,
    borderColor: LightTheme.colors.primary,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  textSelected: {
    color: '#FFFFFF',
  },
});

export default UnitSelector;
