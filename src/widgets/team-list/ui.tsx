import { Grid } from "@mantine/core";
import { useUnit } from "effector-react";
import {
  CONSUMPTION_EVENTS,
  ForecastEvent,
  GENERATION_EVENTS,
  forecastModel,
} from "~/entities/forecast";
import { Construction, TeamCard, teamModel } from "~/entities/team";
import { NUMBER_OF_TICKS } from "~/shared/config/game";

const constructionToForecastEvent: { [key in Construction]: ForecastEvent } = {
  factory: "Заводы",
  hospital: "Больницы",
  house: "Дома",
  "solar-panel": "Солнце",
  windmill: "Ветер",
};

export const TeamList = () => {
  const stores = useUnit({
    teams: teamModel.$teams,
    consumption: forecastModel.$consumption,
  });

  return (
    <Grid>
      {stores.teams.map((team) => {
        // TODO: Вынести куда нибудь
        const income = team.purchases
          .filter((purchase) =>
            CONSUMPTION_EVENTS.includes(
              constructionToForecastEvent[purchase.construction]
            )
          )
          .reduce((sum, purchase) => {
            const totalConsumption =
              stores.consumption[
                constructionToForecastEvent[purchase.construction]
              ]?.total ?? 0;

            return sum + totalConsumption * purchase.price;
          }, 0);

        const loss = team.purchases
          .filter((purchase) =>
            GENERATION_EVENTS.includes(
              constructionToForecastEvent[purchase.construction]
            )
          )
          .reduce((sum, purchase) => sum + NUMBER_OF_TICKS * purchase.price, 0);

        const profit = Math.round((income - loss) * 1e2) / 1e2;

        return (
          <Grid.Col key={team.id} span={4}>
            <TeamCard team={team} profit={profit} />
          </Grid.Col>
        );
      })}
    </Grid>
  );
};
