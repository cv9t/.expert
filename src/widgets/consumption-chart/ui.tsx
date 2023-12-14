import { ApexOptions } from "apexcharts";
import { useUnit } from "effector-react";
import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { forecastModel } from "~/entities/forecast";
import { NUMBER_OF_TICKS } from "~/shared/config/game";

const HEIGHT = 320;

// TODO: Запили сюда стили из useMantineTheme
export const ConsumptionChart = () => {
  const [options] = useState<ApexOptions>({
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      height: HEIGHT,
    },
    yaxis: {
      title: {
        text: "МВт",
      },
      decimalsInFloat: 2,
      labels: {
        formatter: function (val) {
          return Math.round(val).toString();
        },
      },
    },
    xaxis: {
      title: {
        text: "Такт",
      },
      min: 0,
      tickAmount: Math.floor(NUMBER_OF_TICKS / 10),
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
    },
  });
  const consumption = useUnit(forecastModel.$consumption);

  const series = useMemo(
    () =>
      Object.entries(consumption).map(([event, data]) => ({
        name: event,
        data,
      })),
    [consumption]
  );

  return (
    <ReactApexChart
      type="line"
      series={series}
      options={options}
      height={HEIGHT}
    />
  );
};
