// S (SRP): Only fetches and formats weight history for the chart.
// I (ISP): Exposes only { entries, chartData, isLoading, error } — nothing else.

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useProfileStore } from '../store/profileStore';
import { getWeightHistory } from '../services/weightService';
import type { WeightEntry, ChartDataPoint } from '../types';

type UseHistoryReturn = {
  entries: WeightEntry[];
  chartData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const toChartDataPoint = (entry: WeightEntry): ChartDataPoint => ({
  value: parseFloat(entry.weight_kg.toFixed(1)),
  label: format(new Date(entry.recorded_at), 'dd/MM'),
  date: entry.recorded_at,
});

export const useHistory = (): UseHistoryReturn => {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!activeProfile) return;
    setIsLoading(true);
    setError(null);
    const result = await getWeightHistory(activeProfile.id, 7);
    if (result.success) {
      setEntries(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }, [activeProfile]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const chartData = entries.map(toChartDataPoint);

  return { entries, chartData, isLoading, error, refresh: loadHistory };
};
