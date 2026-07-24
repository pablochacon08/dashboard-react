import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface UseFetchDataResult {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

const CITY_COORDS: Record<string, { latitude: number; longitude: number }> = {
  guayaquil: { latitude: -2.1962, longitude: -79.8862 },
  quito: { latitude: -0.1807, longitude: -78.4678 },
  manta: { latitude: 0.9776, longitude: -80.7031 },
  cuenca: { latitude: -2.9006, longitude: -79.0059 },
};

export default function useFetchData(selectedOption: string | null): UseFetchDataResult {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const normalizedOption = selectedOption?.toLowerCase() ?? 'guayaquil';
    const cityConfig = CITY_COORDS[normalizedOption] ?? CITY_COORDS['guayaquil'];
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${cityConfig.latitude}&longitude=${cityConfig.longitude}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const json: OpenMeteoResponse = await response.json();
        setData(json);
      } catch (caughtError) {
        if (caughtError instanceof Error && caughtError.name !== 'AbortError') {
          console.error('Error fetching Open-Meteo data:', caughtError);
          setError('No se pudieron cargar los datos del pronóstico.');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    return () => controller.abort();
  }, [selectedOption]);

  return { data, loading, error };
}