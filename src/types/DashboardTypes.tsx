export interface OpenMeteoResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: CurrentUnits
  current: Current
  hourly_units: HourlyUnits
  hourly: Hourly
  daily_units: DailyUnits
  daily: Daily
}

export interface CurrentUnits {
  time: string
  interval: string
  temperature_2m: string
  relative_humidity_2m: string
  apparent_temperature: string
  wind_speed_10m: string
  precipitation: string
  weather_code: string
  is_day: string
}

export interface Current {
  time: string
  interval: number
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  wind_speed_10m: number
  precipitation: number
  weather_code: number
  is_day: number
}

export interface HourlyUnits {
  time: string
  temperature_2m: string
  wind_speed_10m: string
  weather_code: string
  precipitation_probability: string
}

export interface Hourly {
  time: string[]
  temperature_2m: number[]
  wind_speed_10m: number[]
  weather_code: number[]
  precipitation_probability: number[]
}

export interface DailyUnits {
  time: string
  temperature_2m_max: string
  temperature_2m_min: string
  sunrise: string
  sunset: string
  uv_index_max: string
}

export interface Daily {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  sunrise: string[]
  sunset: string[]
  uv_index_max: number[]
}