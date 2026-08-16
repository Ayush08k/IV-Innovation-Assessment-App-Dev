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

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      weight: defaultValues?.weight,
      height: defaultValues?.height,
      weightUnit,
      heightUnit,
      gender: defaultValues?.gender ?? 'male',
    },
  });

  const handleWeightUnitToggle = (unit: WeightUnit) => {
    setWeightUnit(unit);
    setValue('weightUnit', unit);
  };

  const handleHeightUnitToggle = (unit: HeightUnit) => {
    setHeightUnit(unit);
    setValue('heightUnit', unit);
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
        <Controller
          control={control}
          name="weight"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.weight && styles.inputError]}
              placeholder={`Enter weight in ${weightUnit}`}
              placeholderTextColor={Colors.inputPlaceholder}
              keyboardType="decimal-pad"
              value={value ? String(value) : ''}
              onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
              accessibilityLabel="Weight input"
            />
          )}
        />
        {errors.weight && <Text style={styles.errorText}>{errors.weight.message}</Text>}
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
        <Controller
          control={control}
          name="height"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.height && styles.inputError]}
              placeholder={`Enter height in ${heightUnit}`}
              placeholderTextColor={Colors.inputPlaceholder}
              keyboardType="decimal-pad"
              value={value ? String(value) : ''}
              onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
              accessibilityLabel="Height input"
            />
          )}
        />
        {errors.height && <Text style={styles.errorText}>{errors.height.message}</Text>}
      </View>

      {/* Gender */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Gender</Text>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <View style={styles.genderRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  onPress={() => onChange(g.value)}
                  style={[styles.genderBtn, value === g.value && styles.genderBtnActive]}
                  accessibilityLabel={`Gender ${g.label}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: value === g.value }}
                >
                  <Text style={[styles.genderBtnText, value === g.value && styles.genderBtnTextActive]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.gender && <Text style={styles.errorText}>{errors.gender.message}</Text>}
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
        onPress={handleSubmit(onSubmit)}
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
