// S (SRP): Only responsible for rendering the weight history line chart.
// O (OCP): Accepts generic ChartDataPoint[] — chart library can be swapped
//           by changing only this file, zero impact on consumers.
// I (ISP): Only needs { data, weightUnit } — not full profile or entry objects.

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../theme';
import type { ChartDataPoint, WeightUnit } from '../types';

type Props = {
  data: ChartDataPoint[];
  weightUnit?: WeightUnit;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export const WeightChart: React.FC<Props> = ({ data, weightUnit = 'kg' }) => {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No history yet.</Text>
        <Text style={styles.emptySubtext}>Log your weight to see the graph here.</Text>
      </View>
    );
  }

  const chartData = data.map((d) => ({
    value: weightUnit === 'lbs' ? parseFloat((d.value * 2.20462).toFixed(1)) : d.value,
    label: d.label,
    dataPointText: `${weightUnit === 'lbs' ? (d.value * 2.20462).toFixed(1) : d.value}`,
  }));

  const maxValue = Math.max(...chartData.map((d) => d.value));
  const minValue = Math.min(...chartData.map((d) => d.value));
  const padding = Math.max((maxValue - minValue) * 0.3, 5);

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={SCREEN_WIDTH - 80}
        height={200}
        // Colours
        color={Colors.primary}
        startFillColor={Colors.primary}
        endFillColor={Colors.background}
        startOpacity={0.4}
        endOpacity={0.05}
        areaChart
        // Grid & Axes
        yAxisColor={Colors.surfaceBorder}
        xAxisColor={Colors.surfaceBorder}
        verticalLinesColor={Colors.surfaceBorder + '44'}
        rulesColor={Colors.surfaceBorder + '44'}
        // Labels
        xAxisLabelTextStyle={styles.axisLabel}
        yAxisTextStyle={styles.axisLabel}
        // Data point styling
        dataPointsColor={Colors.primaryLight}
        dataPointsRadius={5}
        dataPointsWidth={5}
        textShiftY={-8}
        textShiftX={-6}
        textColor={Colors.textSecondary}
        textFontSize={FontSize.xs}
        // Range
        maxValue={parseFloat((maxValue + padding).toFixed(0))}
        // Animation
        isAnimated
        animationDuration={800}
        // Pointer
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: Colors.primary + '66',
          pointerStripWidth: 2,
          pointerColor: Colors.primary,
          radius: 6,
          pointerLabelWidth: 90,
          pointerLabelHeight: 50,
          activatePointersOnLongPress: false,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items: any[]) => (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipValue}>
                {items[0].value} {weightUnit}
              </Text>
              <Text style={styles.tooltipDate}>{items[0].label}</Text>
            </View>
          ),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing[2],
    paddingLeft: Spacing[2],
  },
  axisLabel: {
    color: Colors.textMuted,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[12],
  },
  emptyText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing[1],
    textAlign: 'center',
  },
  tooltip: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.primary + '55',
    alignItems: 'center',
  },
  tooltipValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  tooltipDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});
