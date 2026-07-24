import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

export interface UseFetchDataResult {
    data?: OpenMeteoResponse;
    loading: boolean;
    error: string | null;
}

// Estrategia para convertir la opción seleccionada en un objeto
const CITY_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'Guayaquil': { latitude: -2.1962, longitude: -79.8862 },
  'Quito': { latitude: -0.1807, longitude: -78.4678 },
  'Manta': { latitude: -0.947, longitude: -80.708 },
  'Cuenca': { latitude: -2.9006, longitude: -79.0042 },
};

// Tipo del prop: string | null
export default function useFetchData(selectedOption: string | null): UseFetchDataResult {
    const [data, setData] = useState<OpenMeteoResponse>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cityName = selectedOption ?? 'Guayaquil';
        const cityConfig = CITY_COORDS[cityName] ?? CITY_COORDS['Guayaquil'];
        const URL = `https://api.open-meteo.com/v1/forecast?latitude=${cityConfig.latitude}&longitude=${cityConfig.longitude}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=auto`;
        let isMounted = true;

        const getData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(URL);

                if (!response.ok) {
                    throw new Error('Error al obtener los datos del clima');
                }

                const jsonData: OpenMeteoResponse = await response.json();

                if (isMounted) {
                    setData(jsonData);
                }
            } catch (caughtError) {
                if (!isMounted) {
                    return;
                }

                console.error('Error fetching data:', caughtError);
                setData(undefined);
                setError(caughtError instanceof Error ? caughtError.message : 'Error inesperado al obtener los datos del clima');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void getData();

        return () => {
            isMounted = false;
        };
    }, [selectedOption]); // El efecto secundario depende de la opción seleccionada

    return { data, loading, error };
}
