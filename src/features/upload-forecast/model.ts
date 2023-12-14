import {
  createEffect,
  createEvent,
  createStore,
  sample,
  scopeBind,
} from "effector";
import { condition } from "patronum";
import { isForecastValid, transformCsvToForecast } from "./lib";
import { Forecast, forecastModel } from "~/entities/forecast";
import { notification } from "~/shared/lib/notification";

const fileReadSucceed = createEvent<string>();
const fileReadFailed = createEvent();

const readFileFx = createEffect<File, void>((file) => {
  const successFileReadBound = scopeBind(fileReadSucceed, { safe: true });
  const failFileReadBound = scopeBind(fileReadFailed, { safe: true });

  const reader = new FileReader();

  reader.onerror = () => {
    failFileReadBound();
  };

  reader.onload = () => {
    successFileReadBound(reader.result as string);
  };

  reader.readAsText(file);
});

export const fileChanged = createEvent<File>();

const fileContentValidationSucceed = createEvent<Forecast>();
const fileContentValidationFailed = createEvent();

// FIXME: Я так чувствую (буферный файл)
const $tempFile = createStore<File | null>(null);
export const $file = createStore<File | null>(null);

$tempFile.on(fileChanged, (_, file) => file).reset(fileContentValidationFailed);

sample({ clock: fileChanged, target: readFileFx });

const fileContentTransformed = sample({
  clock: fileReadSucceed,
  fn: (fileContent) => transformCsvToForecast(fileContent),
});

condition({
  source: fileContentTransformed,
  if: isForecastValid,
  then: fileContentValidationSucceed,
  else: fileContentValidationFailed,
});

sample({
  clock: fileContentValidationSucceed,
  source: $tempFile,
  target: $file,
});

sample({
  clock: fileContentValidationSucceed,
  target: [
    forecastModel.forecastChanged,
    notification.successNotified.prepend(() => ({
      title: "Успешная операция",
      message: "Файл с прогнозами успешно загружен",
    })),
  ],
});

sample({
  clock: fileContentValidationFailed,
  target: notification.errorNotified.prepend(() => ({
    title: "Неудачная операция",
    message: "Неверный формат файла",
  })),
});

sample({
  clock: fileReadFailed,
  target: notification.errorNotified.prepend(() => ({
    title: "Неудачная операция",
    message: "Ошибка при чтении файла",
  })),
});
