// S (SRP): Only renders the user details input form.
// I (ISP): onSubmit receives minimal UserDetailsFormData — no awareness of BMI logic.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userDetailsSchema, type UserDetailsFormData } from '../utils/validation';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../theme';
import type { WeightUnit, HeightUnit, Gender } from '../types';

type Props = {
  onSubmit: (data: UserDetailsFormData) => Promise<boolean>;
  isSubmitting: boolean;
  defaultValues?: Partial<UserDetailsFormData>;
};

const GENDERS: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export const UserDetailsForm: React.FC<Props> = ({
  onSubmit,
  isSubmitting,
  defaultValues,
}) => {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(defaultValues?.weightUnit ?? 'kg');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(defaultValues?.heightUnit ?? 'cm');
  const [weightText, setWeightText] = useState(defaultValues?.weight ? String(defaultValues.weight) : '');
  const [heightText, setHeightText] = useState(defaultValues?.height ? String(defaultValues.height) : '');
  const [gender, setGender] = useState<Gender>(defaultValues?.gender ?? 'male');
  const [validationErrors, setValidationErrors] = useState<{ weight?: string; height?: string }>({});

  const handleWeightUnitToggle = (unit: WeightUnit) => {
    setWeightUnit(unit);
  };

  const handleHeightUnitToggle = (unit: HeightUnit) => {
    setHeightUnit(unit);
  };

  const handleFormSubmit = async () => {
    const numWeight = parseFloat(weightText);
    const numHeight = parseFloat(heightText);
    const errors: { weight?: string; height?: string } = {};

    if (!weightText || isNaN(numWeight) || numWeight <= 0) {
      errors.weight = 'Please enter a valid positive weight';
    }
    if (!heightText || isNaN(numHeight) || numHeight <= 0) {
      errors.height = 'Please enter a valid positive height';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    const success = await onSubmit({
      weight: numWeight,
      weightUnit,
      height: numHeight,
      heightUnit,
      gender,
    });
    if (success) {
      setWeightText('');
      setHeightText('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Weight */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.unitToggle}>
            {(['kg', 'lbs'] as WeightUnit[]).map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => handleWeightUnitToggle(u)}
                style={[styles.unitBtn, weightUnit === u && styles.unitBtnActive]}
                accessibilityLabel={`Weight unit ${u}`}
              >
                <Text style={[styles.unitBtnText, weightUnit === u && styles.unitBtnTextActive]}>
                  {u.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TextInput
          style={[styles.input, validationErrors.weight && styles.inputError]}
          placeholder={`Enter weight in ${weightUnit}`}
          placeholderTextColor={Colors.inputPlaceholder}
          keyboardType="decimal-pad"
          value={weightText}
          onChangeText={(text) => {
            setWeightText(text);
            if (validationErrors.weight) setValidationErrors((prev) => ({ ...prev, weight: undefined }));
          }}
          accessibilityLabel="Weight input"
        />
        {validationErrors.weight && <Text style={styles.errorText}>{validationErrors.weight}</Text>}
      </View>

      {/* Height */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Height</Text>
          <View style={styles.unitToggle}>
            {(['cm', 'inches'] as HeightUnit[]).map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => handleHeightUnitToggle(u)}
                style={[styles.unitBtn, heightUnit === u && styles.unitBtnActive]}
                accessibilityLabel={`Height unit ${u}`}
              >
                <Text style={[styles.unitBtnText, heightUnit === u && styles.unitBtnTextActive]}>
                  {u === 'inches' ? 'IN' : u.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TextInput
          style={[styles.input, validationErrors.height && styles.inputError]}
          placeholder={`Enter height in ${heightUnit}`}
          placeholderTextColor={Colors.inputPlaceholder}
          keyboardType="decimal-pad"
          value={heightText}
          onChangeText={(text) => {
            setHeightText(text);
            if (validationErrors.height) setValidationErrors((prev) => ({ ...prev, height: undefined }));
          }}
          accessibilityLabel="Height input"
        />
        {validationErrors.height && <Text style={styles.errorText}>{validationErrors.height}</Text>}
      </View>

      {/* Gender */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g.value}
              onPress={() => setGender(g.value)}
              style={[styles.genderBtn, gender === g.value && styles.genderBtnActive]}
              accessibilityLabel={`Gender ${g.label}`}
              accessibilityRole="radio"
              accessibilityState={{ checked: gender === g.value }}
            >
              <Text style={[styles.genderBtnText, gender === g.value && styles.genderBtnTextActive]}>
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
        onPress={handleFormSubmit}
        disabled={isSubmitting}
        accessibilityLabel="Calculate BMI"
        accessibilityRole="button"
      >
        {isSubmitting ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <Text style={styles.submitText}>Calculate BMI</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing[5],
  },
  fieldGroup: {
    gap: Spacing[2],
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.md,
    padding: Spacing[4],
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  unitBtn: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  unitBtnActive: {
    backgroundColor: Colors.primary,
  },
  unitBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  unitBtnTextActive: {
    color: Colors.white,
  },
  genderRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  genderBtn: {
    flex: 1,
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  genderBtnActive: {
    backgroundColor: Colors.primary + '22',
    borderColor: Colors.primary,
  },
  genderBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  genderBtnTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});
