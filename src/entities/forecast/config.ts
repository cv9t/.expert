import { ForecastEvent } from "./model/types";

export const CONSUMPTION_EVENTS: ForecastEvent[] = [
  "Больницы",
  "Дома",
  "Заводы",
];

export const GENERATION_EVENTS: ForecastEvent[] = ["Ветер", "Солнце"];

export const realConsumptions: { [key in ForecastEvent]?: number } = {
  ["Больницы"]: 0.94274,
  ["Заводы"]: 0.93672,
  ["Дома"]: 0.93296,
};

export const realGenerations: { [key in ForecastEvent]?: number } = {
  ["Солнце"]: 2.1,
  ["Ветер"]: 0.9,
};
