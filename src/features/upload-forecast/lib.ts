import { Forecast, ForecastEvent } from "~/entities/forecast";

export const transformCsvToForecast = (fileContent: string): Forecast => {
  const lines = fileContent.split("\n");
  const labels = lines[0].split(",").map((label) => label.trim());

  const forecast = Object.fromEntries(
    labels.map((label) => [label, []])
  ) as unknown as Forecast;

  for (const line of lines.slice(1)) {
    const data = line.split(",").map((value) => value.trim());
    data.forEach((value, index) => {
      forecast[labels[index] as ForecastEvent].push(Number(value));
    });
  }

  return forecast;
};

const areKeysValid = (keys: string[], allowedKeys: string[]): boolean => {
  const sortedKeys = keys.slice().sort();
  const sortedAllowedKeys = allowedKeys.slice().sort();

  return JSON.stringify(sortedKeys) === JSON.stringify(sortedAllowedKeys);
};

const isArrayValid = (array: number[]): boolean => {
  return array.every((value) => !isNaN(value) && typeof value === "number");
};

export const isForecastValid = (forecast: Forecast): boolean => {
  const allowedKeys: ForecastEvent[] = [
    "Ветер",
    "Солнце",
    "Больницы",
    "Заводы",
    "Дома",
  ];

  const forecastKeys = Object.keys(forecast);
  if (!areKeysValid(forecastKeys, allowedKeys)) {
    return false;
  }

  for (const key in forecast) {
    // eslint-disable-next-line no-prototype-builtins
    if (forecast.hasOwnProperty(key)) {
      const forecastValues = forecast[key as ForecastEvent];
      if (!isArrayValid(forecastValues)) {
        return false;
      }
    }
  }
  return true;
};
