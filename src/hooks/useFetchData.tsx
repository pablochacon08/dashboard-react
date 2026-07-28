import { useCallback, useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface UseFetchDataResult {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshData: () => void;
}

export default function useFetchData(
  latitude: number,
  longitude: number
): UseFetchDataResult {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  const refreshData = useCallback(() => {
    setRefreshCounter((currentValue) => currentValue + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code,is_day` +
      `&hourly=temperature_2m,wind_speed_10m,weather_code,precipitation_probability,relative_humidity_2m,uv_index` +
      `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max` +
      `&timezone=auto`;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: ${response.statusText}`
          );
        }

        const json: OpenMeteoResponse = await response.json();

        setData(json);
        setLastUpdated(new Date());
      } catch (caughtError) {
        if (
          caughtError instanceof Error &&
          caughtError.name !== 'AbortError'
        ) {
          console.error(
            'Error fetching Open-Meteo data:',
            caughtError
          );

          setError(
            'No se pudieron cargar los datos del pronóstico.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      controller.abort();
    };
  }, [latitude, longitude, refreshCounter]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refreshData,
  };
}