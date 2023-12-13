import { createEvent, createStore } from "effector";
import { __DEV__ } from "~/shared/config/env";
import { Purchase, Team } from "./types";

export const teamAdded = createEvent<Team>();
export const teamRemoved = createEvent<string>();
export const teamNameEdited = createEvent<{ teamId: string; name: string }>();

export const purchaseAdded = createEvent<{
  teamId: string;
  purchase: Purchase;
}>();
export const purchaseRemoved = createEvent<{
  teamId: string;
  purchaseId: string;
}>();
export const purchaseEdited = createEvent<{
  teamId: string;
  purchase: Purchase;
}>();

export const $teams = createStore<Team[]>([]);

$teams
  .on(teamAdded, (teams, newTeam) => [...teams, newTeam])
  .on(teamRemoved, (teams, removeId) =>
    teams.filter((team) => team.id !== removeId)
  )
  .on(teamNameEdited, (teams, { teamId, name }) =>
    teams.map((team) => (team.id === teamId ? { ...team, name } : team))
  )
  .on(purchaseAdded, (teams, { teamId, purchase }) =>
    teams.map((team) =>
      team.id === teamId
        ? { ...team, purchases: [...team.purchases, purchase] }
        : team
    )
  )
  .on(purchaseRemoved, (teams, { teamId, purchaseId }) =>
    teams.map((team) =>
      team.id === teamId
        ? {
            ...team,
            purchases: team.purchases.filter(
              (purchase) => purchase.id !== purchaseId
            ),
          }
        : team
    )
  )
  .on(purchaseEdited, (teams, { teamId, purchase: editedPurchase }) =>
    teams.map((team) =>
      team.id === teamId
        ? {
            ...team,
            purchases: team.purchases.map((purchase) =>
              purchase.id === editedPurchase.id ? editedPurchase : purchase
            ),
          }
        : team
    )
  );

if (__DEV__) {
  $teams.watch((state) => {
    console.log("teams", state);
  });
}
