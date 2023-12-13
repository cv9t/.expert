import { Button, Group, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { teamModel, Construction } from "~/entities/team";
import { IconPlus } from "@tabler/icons-react";
import { useUnit } from "effector-react";
import { FormValues, formSubmitted } from "./model";

const constructionData: { value: Construction; label: string }[] = [
  {
    value: "house",
    label: "Дом",
  },
  {
    value: "factory",
    label: "Завод",
  },
  {
    value: "hospital",
    label: "Больница",
  },
  {
    value: "solar-panel",
    label: "Солнечная панель",
  },
  {
    value: "windmill",
    label: "Ветренная мельница",
  },
];

export const AddPurchase = () => {
  const form = useForm<FormValues>({
    initialValues: {
      teamId: "",
      construction: "",
      price: 0,
    },
    validate: {
      teamId: (value) => (!value ? "Обязательное поле" : null),
      construction: (value) => (!value ? "Обязательное поле" : null),
      price: (value) => {
        if (String(value) === "") {
          return "Обязательное поле";
        }
        return null;
      },
    },
  });
  const teams = useUnit(teamModel.$teams);

  const formattedTeams = teams.map((team) => ({
    value: team.id,
    label: team.name,
  }));

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        formSubmitted(values);
        form.reset();
      })}
    >
      <Group align="flex-start">
        <Select
          placeholder="Команда"
          data={formattedTeams}
          {...form.getInputProps("teamId")}
        />
        <Select
          placeholder="Тип недвижимости"
          data={constructionData}
          {...form.getInputProps("construction")}
        />
        <NumberInput
          type="number"
          min={0}
          max={100}
          placeholder="Цена"
          {...form.getInputProps("price")}
        />
        <Button type="submit" leftIcon={<IconPlus size="1.3rem" />}>
          Добавить покупку
        </Button>
      </Group>
    </form>
  );
};
