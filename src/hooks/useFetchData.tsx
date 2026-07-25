import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface UseFetchDataResult {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

// Ahora el hook recibe coordenadas directamente
export default function useFetchData(latitude: number, longitude: number): UseFetchDataResult {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    // Inyectamos la latitud y longitud en la URL
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code,is_day&hourly=temperature_2m,wind_speed_10m,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;

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
  }, [latitude, longitude]); // El efecto se dispara cuando cambian las coordenadas

  return { data, loading, error };
}