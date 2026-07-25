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
  precipitation: string
  weather_code: string
  is_day: string
  wind_speed_10m: string
}

export interface Current {
  time: string
  interval: number
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  precipitation: number
  weather_code: number
  is_day: number
  wind_speed_10m: number
}

export interface HourlyUnits {
  time: string
  temperature_2m: string
  weather_code: string
  precipitation_probability: string
  wind_speed_10m: string
  relative_humidity_2m: string
  uv_index: string
}

export interface Hourly {
  time: string[]
  temperature_2m: number[]
  weather_code: number[]
  precipitation_probability: number[]
  wind_speed_10m: number[]
  relative_humidity_2m: number[]
  uv_index: number[]
}

export interface DailyUnits {
  time: string
  sunrise: string
  sunset: string
  temperature_2m_max: string
  temperature_2m_min: string
  uv_index_max: string
}

export interface Daily {
  time: string[]
  sunrise: string[]
  sunset: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  uv_index_max: number[]
}