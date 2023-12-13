export type Construction =
  | "house"
  | "factory"
  | "hospital"
  | "solar-panel"
  | "windmill";

export type Team = {
  id: string;
  name: string;
  purchases: {
    id: string;
    construction: Construction;
    price: number;
    canEdit: boolean;
  }[];
};
