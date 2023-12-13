import { Fragment, ReactNode, useCallback, useEffect, useState } from "react";
import {
  Text,
  Card,
  Group,
  Button,
  Flex,
  Popover,
  Select,
  Box,
  NumberInput,
  ActionIcon,
} from "@mantine/core";
import { EditableText, Icon } from "~/shared/ui";
import { Team, Construction } from "../model/types";
import {
  purchaseRemoved,
  teamNameEdited,
  teamRemoved,
  purchaseEdited,
} from "../model";
import { useForm } from "@mantine/form";

// TODO: Вся Россия в этом виновата (декомпозировать)
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

type EditPurchasePopoverProps = {
  teamId: string;
  purchase: Team["purchases"][number];
  children: ReactNode;
};

const EditPurchasePopover = ({
  teamId,
  purchase,
  children,
}: EditPurchasePopoverProps) => {
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      construction: "",
      price: 0,
    },
    validate: {
      construction: (value) => (!value ? "Обязательное поле" : null),
      price: (value) => {
        if (String(value) === "") {
          return "Обязательное поле";
        }
        return null;
      },
    },
  });

  const setInitialValues = useCallback(() => {
    form.setValues({
      construction: purchase.construction,
      price: purchase.price,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchase.construction, purchase.price]);

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

  return (
    <Popover
      opened={opened}
      withinPortal
      width={300}
      trapFocus
      position="top"
      shadow="lg"
      onChange={setOpened}
      onClose={() => {
        setInitialValues();
      }}
    >
      <Popover.Target>
        <Box
          sx={{ width: "100%" }}
          onClick={() => {
            setOpened(true);
          }}
        >
          {children}
        </Box>
      </Popover.Target>
      <Popover.Dropdown>
        <form
          onSubmit={form.onSubmit((values) => {
            purchaseEdited({
              teamId,
              purchase: {
                ...purchase,
                construction: values.construction as Construction,
                price: values.price,
              },
            });
            setOpened(false);
          })}
        >
          <Group>
            <Select
              w="100%"
              placeholder="Тип недвижимости"
              data={constructionData}
              {...form.getInputProps("construction")}
            />
            <NumberInput
              w="100%"
              min={0}
              max={100}
              placeholder="Цена"
              {...form.getInputProps("price")}
            />
            <Button type="submit" fullWidth variant="light">
              Сохранить
            </Button>
          </Group>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};
// --------------------------------

const constructionIcons: { [key in Construction]: ReactNode } = {
  factory: <Icon type="factory" />,
  hospital: <Icon type="hospital" />,
  house: <Icon type="home" />,
  "solar-panel": <Icon type="solar-panel" />,
  windmill: <Icon type="windmill" />,
};

export type TeamCardProps = {
  team: Team;
  profit: number;
};

// TODO: Добавить ScrollView
export const TeamCard = ({ team, profit }: TeamCardProps) => {
  return (
    <Card withBorder radius="md">
      <Card.Section withBorder inheritPadding py="sm">
        <Group position="apart" noWrap>
          <EditableText
            value={team.name}
            onEdit={(name) => {
              teamNameEdited({ teamId: team.id, name });
            }}
            styles={{
              text: {
                fontWeight: 500,
              },
            }}
          />
          <ActionIcon
            color="red"
            variant="light"
            onClick={() => {
              teamRemoved(team.id);
            }}
          >
            <Icon type="x" />
          </ActionIcon>
        </Group>
      </Card.Section>
      <Flex mt="md" direction="column" gap="md">
        {team.purchases.map((purchase) => (
          <Fragment key={purchase.id}>
            {purchase.canEdit ? (
              <Group position="apart" noWrap>
                <EditPurchasePopover teamId={team.id} purchase={purchase}>
                  <Group sx={{ width: "100%", cursor: "pointer" }}>
                    {constructionIcons[purchase.construction]}
                    <Text>{purchase.price}</Text>
                  </Group>
                </EditPurchasePopover>
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => {
                    purchaseRemoved({
                      teamId: team.id,
                      purchaseId: purchase.id,
                    });
                  }}
                >
                  <Icon type="x" />
                </ActionIcon>
              </Group>
            ) : (
              <Group>
                {constructionIcons[purchase.construction]}
                <Text>{purchase.price}</Text>
              </Group>
            )}
          </Fragment>
        ))}
        <Group>
          <Text>
            <b>Итоговая прибыль:</b>{" "}
            <Text component="span" color={profit >= 0 ? "green" : "red"}>
              {profit} ₽
            </Text>
          </Text>
        </Group>
      </Flex>
    </Card>
  );
};
