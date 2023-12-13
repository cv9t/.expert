export type ForecastEvent = "Ветер" | "Солнце" | "Больницы" | "Заводы" | "Дома";

export type Forecast = Record<ForecastEvent, number[]>;

export type Consumption = {
  [key in ForecastEvent]?: {
    data: number[];
    total: number;
  };
};

export type Generation = { event: ForecastEvent; data: number[] }[];
