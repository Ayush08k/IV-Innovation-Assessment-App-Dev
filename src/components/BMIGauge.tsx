// S (SRP): Only renders the animated BMI arc gauge.
// I (ISP): Only needs { bmi: number } — zero coupling to profile or nav.

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getBMICategory, bmiToGaugeProgress } from '../utils/bmi';
import { Colors, FontFamily, FontSize, Spacing } from '../theme';

type Props = {
  bmi: number;
};

const GAUGE_SEGMENTS = [
  { label: 'Under', color: Colors.underweight, flex: 1 },
  { label: 'Normal', color: Colors.normal, flex: 1.3 },
  { label: 'Over', color: Colors.overweight, flex: 1 },
  { label: 'Obese', color: Colors.obese, flex: 1 },
];

export const BMIGauge: React.FC<Props> = ({ bmi }) => {
  const category = getBMICategory(bmi);
  const progress = bmiToGaugeProgress(bmi);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bmi]);

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      {/* BMI Number */}
      <Text style={[styles.bmiValue, { color: category.color }]}>
        {bmi.toFixed(1)}
      </Text>
      <Text style={styles.bmiLabel}>BMI</Text>

      {/* Colour Bar Gauge */}
      <View style={styles.gaugeTrack}>
        {GAUGE_SEGMENTS.map((seg) => (
          <View
            key={seg.label}
            style={[styles.segment, { backgroundColor: seg.color, flex: seg.flex }]}
          />
        ))}
        {/* Needle */}
        <View
          style={[
            styles.needle,
            { left: `${(progress * 92 + 4)}%` as any },
          ]}
        />
      </View>

      {/* Segment Labels */}
      <View style={styles.segmentLabels}>
        {GAUGE_SEGMENTS.map((seg) => (
          <Text key={seg.label} style={[styles.segmentLabel, { color: seg.color }]}>
            {seg.label}
          </Text>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing[6],
  },
  bmiValue: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['5xl'],
    lineHeight: FontSize['5xl'] * 1.1,
  },
  bmiLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    letterSpacing: 3,
    marginBottom: Spacing[5],
  },
  gaugeTrack: {
    flexDirection: 'row',
    width: '90%',
    height: 10,
    borderRadius: 5,
    overflow: 'visible',
    position: 'relative',
  },
  segment: {
    height: '100%',
  },
  needle: {
    position: 'absolute',
    top: -6,
    width: 4,
    height: 22,
    backgroundColor: Colors.white,
    borderRadius: 2,
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
    marginLeft: -2,
  },
  segmentLabels: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginTop: Spacing[2],
  },
  segmentLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
});
