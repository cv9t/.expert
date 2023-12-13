import { createEvent, sample } from "effector";
import { nanoid } from "nanoid";
import { Team, teamModel } from "~/entities/team";

export type FormValues = {
  teamName: string;
};

export const formSubmitted = createEvent<FormValues>();

sample({
  clock: formSubmitted,
  fn: (values): Team => ({
    id: nanoid(),
    name: values.teamName,
    purchases: [
      {
        id: nanoid(),
        construction: "house",
        price: 5,
        canEdit: false,
      },
      {
        id: nanoid(),
        construction: "solar-panel",
        price: 5,
        canEdit: false,
      },
    ],
  }),
  target: teamModel.teamAdded,
});
