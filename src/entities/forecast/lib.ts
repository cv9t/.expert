import {
  Forecast,
  Consumption,
  ForecastEvent,
  Generation,
  TotalConsumption,
  TotalGeneration,
} from "./model/types";
import {
  CONSUMPTION_EVENTS,
  realConsumptions,
  GENERATION_EVENTS,
  realGenerations,
} from "./config";

// TODO: мб вынести две функции и сделать их более гибкими

export const calculateConsumption = (forecast: Forecast): Consumption => {
  const consumption: Consumption = {};
  for (const forecastEvent of Object.keys(forecast) as ForecastEvent[]) {
    if (CONSUMPTION_EVENTS.includes(forecastEvent)) {
      const forecastData = forecast[forecastEvent];
      const realConsumption = realConsumptions[forecastEvent];
      const consumptionData = forecastData.map((value) =>
        realConsumption ? realConsumption * value : value
      );
      consumption[forecastEvent] = consumptionData;
    }
  }
  return consumption;
};

export const calculateTotalConsumption = (
  consumption: Consumption
): TotalConsumption => {
  return Object.fromEntries(
    Object.entries(consumption).map(([event, data]) => [
      event as ForecastEvent,
      data.reduce((sum, value) => sum + value, 0),
    ])
  );
};

export const calculateGeneration = (forecast: Forecast): Generation => {
  const generation: Generation = {};
  for (const forecastEvent of Object.keys(forecast) as ForecastEvent[]) {
    if (GENERATION_EVENTS.includes(forecastEvent)) {
      const forecastData = forecast[forecastEvent];
      const realGeneration = realGenerations[forecastEvent];
      const generationData = forecastData.map((value) =>
        realGeneration ? realGeneration * value : value
      );
      generation[forecastEvent] = generationData;
    }
  }
  return generation;
};

export const calculateTotalGeneration = (
  generation: Generation
): TotalGeneration => {
  return Object.fromEntries(
    Object.entries(generation).map(([event, data]) => [
      event as ForecastEvent,
      data.reduce((sum, value) => sum + value, 0),
    ])
  );
};
