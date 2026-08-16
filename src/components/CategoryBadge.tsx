// S (SRP): Only responsible for rendering the BMI category badge.
// I (ISP): Only needs { bmi: number } — nothing about profiles or auth.
// O (OCP): Uses BMI_CATEGORIES array — new categories auto-render correctly.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getBMICategory } from '../utils/bmi';
import { FontFamily, FontSize, BorderRadius, Spacing } from '../theme';

type Props = {
  bmi: number;
};

export const CategoryBadge: React.FC<Props> = ({ bmi }) => {
  const category = getBMICategory(bmi);

  return (
    <View style={[styles.container, { backgroundColor: category.color + '22', borderColor: category.color + '55' }]}>
      <View style={[styles.dot, { backgroundColor: category.color }]} />
      <Text style={[styles.label, { color: category.color }]}>{category.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'center',
    gap: Spacing[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
