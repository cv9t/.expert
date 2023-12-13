import { createEvent, createStore } from "effector";
import { __DEV__ } from "~/shared/config/env";
import { Forecast } from "./types";
import { calculateConsumption, calculateGeneration } from "../lib";

export const forecastChanged = createEvent<Forecast>();

export const $forecast = createStore<Forecast | null>(null);
export const $forecastSpecified = $forecast.map(Boolean);

export const $consumption = $forecast.map((forecast) =>
  forecast ? calculateConsumption(forecast) : {}
);
// TODO: Сделать также как и generation
export const $generation = $forecast.map((forecast) =>
  forecast ? calculateGeneration(forecast) : []
);

$forecast.on(forecastChanged, (_, forecast) => forecast);

if (__DEV__) {
  $forecast.watch((state) => {
    console.log("forecast", state);
  });
}
