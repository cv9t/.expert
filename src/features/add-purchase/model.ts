import { createEvent, sample } from "effector";
import { nanoid } from "nanoid";
import { Construction, teamModel } from "~/entities/team";

export type FormValues = {
  teamId: string;
  construction: string;
  price: number;
};

export const formSubmitted = createEvent<FormValues>();

sample({
  clock: formSubmitted,
  fn: (values) => ({
    teamId: values.teamId,
    purchase: {
      id: nanoid(),
      construction: values.construction as Construction,
      price: values.price,
      canEdit: true,
    },
  }),
  target: teamModel.purchaseAdded,
});
