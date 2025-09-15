import { OWM_KEY } from "../../env.ts";

const BASE = "https://api.openweathermap.org/data/3.0/onecall";
const GOOD_TEMP = 288.15; // 15°C in Kelvin
const MAX_RAIN_PROB = 0.3;

// data types
type Daily = {
    temp: { day: number };
    pop?: number; // OWM can omit this, so make it optional
};

type OneCall = {
    daily: Daily[];
    alerts?: unknown[];
};

type WeekendForecast = {
    goodWeather: boolean;
    alerts: unknown[];
    daily: Daily[];
};

export async function getWeekendForecast(lat: number, lon: number): Promise<WeekendForecast> {
    const url = `${BASE}?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${OWM_KEY}`;
    const res = await fetch(url);
    const json = (await res.json() as OneCall);
    const weekend = json.daily.slice(0, 3);
    const good = weekend.every((d) =>
        d.temp.day >= GOOD_TEMP && (d.pop ?? 0) <= MAX_RAIN_PROB
    );
    return {
        goodWeather: good,
        alerts: json.alerts ?? [],
        daily: weekend,
    };
}
