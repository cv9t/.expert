import {
  Forecast,
  Consumption,
  ForecastEvent,
  Generation,
} from "./model/types";
import {
  CONSUMPTION_EVENTS,
  realConsumptions,
  GENERATION_EVENTS,
  realGenerations,
} from "./config";

export const calculateConsumption = (forecast: Forecast): Consumption => {
  const consumption: Consumption = {};
  for (const forecastEvent of Object.keys(forecast) as ForecastEvent[]) {
    const realConsumption = realConsumptions[forecastEvent];
    if (CONSUMPTION_EVENTS.includes(forecastEvent) && realConsumption) {
      const forecastData = forecast[forecastEvent];
      const data = forecastData.map((value) => realConsumption * value);
      const total = data.reduce((sum, value) => sum + value, 0);
      consumption[forecastEvent] = {
        data,
        total,
      };
    }
  }
  return consumption;
};

export const calculateGeneration = (forecast: Forecast): Generation => {
  return Object.entries(forecast)
    .filter(([event]) => GENERATION_EVENTS.includes(event as ForecastEvent))
    .map(([event, data]) => ({
      event: event as ForecastEvent,
      data: data.map((value) => {
        const real = realGenerations[event as ForecastEvent];
        return real ? value * real : value;
      }),
    }));
};
