import { createEvent, createStore } from "effector";
import { __DEV__ } from "~/shared/config/env";
import {
  Consumption,
  Forecast,
  Generation,
  TotalConsumption,
  TotalGeneration,
} from "./types";
import {
  calculateConsumption,
  calculateGeneration,
  calculateTotalConsumption,
  calculateTotalGeneration,
} from "../lib";

export const forecastChanged = createEvent<Forecast>();

export const $forecast = createStore<Forecast | null>(null);
export const $forecastSpecified = $forecast.map(Boolean);

export const $consumption = $forecast.map<Consumption>((forecast) =>
  forecast ? calculateConsumption(forecast) : {}
);
export const $totalConsumption = $consumption.map<TotalConsumption>(
  (consumption) => calculateTotalConsumption(consumption)
);

export const $generation = $forecast.map<Generation>((forecast) =>
  forecast ? calculateGeneration(forecast) : {}
);
export const $totalGeneration = $generation.map<TotalGeneration>((generation) =>
  calculateTotalGeneration(generation)
);

$forecast.on(forecastChanged, (_, forecast) => forecast);

if (__DEV__) {
  $forecast.watch((state) => {
    console.log("forecast", state);
  });
}
