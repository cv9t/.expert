import { Button, Group, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { FormValues, formSubmitted } from "./model";

export const AddTeam = () => {
  const form = useForm<FormValues>({
    initialValues: {
      teamName: "",
    },
    validate: {
      teamName: (value) =>
        value.trim().length === 0 ? "Обязательное поле" : null,
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        formSubmitted(values);
        form.reset();
      })}
    >
      <Group align="flex-start">
        <TextInput
          maw={320}
          w="100%"
          placeholder="Название команды"
          {...form.getInputProps("teamName")}
        />
        <Button type="submit" leftIcon={<IconPlus size="1.3rem" />}>
          Добавить команду
        </Button>
      </Group>
    </form>
  );
};
