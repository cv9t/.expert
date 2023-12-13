export type ForecastEvent = "Ветер" | "Солнце" | "Больницы" | "Заводы" | "Дома";

export type Forecast = Record<ForecastEvent, number[]>;

export type Consumption = {
  [key in ForecastEvent]?: number[];
};

export type TotalConsumption = {
  [key in ForecastEvent]?: number;
};

export type Generation = {
  [key in ForecastEvent]?: number[];
};

export type TotalGeneration = {
  [key in ForecastEvent]?: number;
};
