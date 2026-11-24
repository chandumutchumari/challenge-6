import { useState, useEffect } from 'react';
import { TransportImpactCalculation } from '@/types';
import { calculateTransportImpact, CalculateImpactParams } from '@/lib/impact/calculator';

type BaselineMode = CalculateImpactParams['baseline_mode'];
type AlternativeMode = CalculateImpactParams['alternative_mode'];

interface UseTransportImpactReturn {
  distance: number;
  setDistance: (km: number) => void;
  unit: 'km' | 'mi';
  setUnit: (unit: 'km' | 'mi') => void;
  baselineMode: BaselineMode;
  setBaselineMode: (mode: BaselineMode) => void;
  alternativeMode: AlternativeMode;
  setAlternativeMode: (mode: AlternativeMode) => void;
  impactResult: TransportImpactCalculation;
}

/**
 * Custom hook to manage transport impact calculations and modal emissions comparisons.
 */
export function useTransportImpact(): UseTransportImpactReturn {
  const [distance, setDistance] = useState<number>(10);
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [baselineMode, setBaselineMode] = useState<BaselineMode>('car_gasoline');
  const [alternativeMode, setAlternativeMode] = useState<AlternativeMode>('transit_bus');

  const [impactResult, setImpactResult] = useState<TransportImpactCalculation>(() =>
    calculateTransportImpact({
      distance_value: distance,
      distance_unit: unit,
      baseline_mode: baselineMode,
      alternative_mode: alternativeMode,
    })
  );

  useEffect(() => {
    setImpactResult(
      calculateTransportImpact({
        distance_value: distance,
        distance_unit: unit,
        baseline_mode: baselineMode,
        alternative_mode: alternativeMode,
      })
    );
  }, [distance, unit, baselineMode, alternativeMode]);

  return {
    distance,
    setDistance,
    unit,
    setUnit,
    baselineMode,
    setBaselineMode,
    alternativeMode,
    setAlternativeMode,
    impactResult,
  };
}
