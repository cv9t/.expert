import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Text,
  Card,
  Group,
  Button,
  Popover,
  Select,
  Box,
  NumberInput,
  ActionIcon,
  rem,
  Stack,
} from "@mantine/core";
import { EditableText, Icon } from "~/shared/ui";
import { Team, Construction, Purchase } from "../model/types";
import {
  purchaseRemoved,
  teamNameEdited,
  teamRemoved,
  purchaseEdited,
} from "../model";
import { useForm } from "@mantine/form";
// FIXME: Кросс импорт на уровне слайса (вынести карточку в widget)
import {
  CONSUMPTION_EVENTS,
  ForecastEvent,
  GENERATION_EVENTS,
  forecastModel,
} from "~/entities/forecast";
import { useUnit } from "effector-react";
import { NUMBER_OF_TICKS } from "~/shared/config/game";

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
  purchase: Purchase;
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

const constructionToForecastEvent: { [key in Construction]: ForecastEvent } = {
  factory: "Заводы",
  hospital: "Больницы",
  house: "Дома",
  "solar-panel": "Солнце",
  windmill: "Ветер",
};

export type TeamCardProps = {
  team: Team;
};

// TODO: Добавить ScrollView
export const TeamCard = ({ team }: TeamCardProps) => {
  const { totalConsumption, totalGeneration } = useUnit({
    totalConsumption: forecastModel.$totalConsumption,
    totalGeneration: forecastModel.$totalGeneration,
  });

  // TODO: Вынести бы
  const profit = useMemo(() => {
    const income = team.purchases
      .filter((purchase) =>
        CONSUMPTION_EVENTS.includes(
          constructionToForecastEvent[purchase.construction]
        )
      )
      .reduce(
        (sum, purchase) =>
          sum +
          (totalConsumption[
            constructionToForecastEvent[purchase.construction]
          ] ?? 0) *
            purchase.price,
        0
      );

    const loss = team.purchases
      .filter((purchase) =>
        GENERATION_EVENTS.includes(
          constructionToForecastEvent[purchase.construction]
        )
      )
      .reduce((sum, purchase) => sum + NUMBER_OF_TICKS * purchase.price, 0);

    return income - loss;
  }, [team.purchases, totalConsumption]);

  // TODO: Вынести бы
  const [totalPurchasedConsumption, totalPurchasedGeneration] = useMemo(() => {
    let totalPurchasedConsumption = 0;
    let totalPurchasedGeneration = 0;

    for (const purchase of team.purchases) {
      const forecastEvent = constructionToForecastEvent[purchase.construction];
      const purchasedConsumption = totalConsumption[forecastEvent];
      const purchasedGeneration = totalGeneration[forecastEvent];
      if (typeof purchasedConsumption !== "undefined") {
        totalPurchasedConsumption += purchasedConsumption;
      } else if (typeof purchasedGeneration !== "undefined") {
        totalPurchasedGeneration += purchasedGeneration;
      }
    }

    return [totalPurchasedConsumption, totalPurchasedGeneration];
  }, [team.purchases, totalConsumption, totalGeneration]);

  const energyBalance = totalPurchasedGeneration - totalPurchasedConsumption;

  let recalculatedProfit = profit;
  if (energyBalance < 0) {
    recalculatedProfit += energyBalance * 10;
  } else {
    recalculatedProfit += energyBalance;
  }

  const deviation =
    ((totalPurchasedGeneration - totalPurchasedConsumption) /
      (totalPurchasedGeneration + totalPurchasedConsumption)) *
    50;

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
      <Card.Section withBorder inheritPadding py="sm">
        <Stack spacing="sm">
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
        </Stack>
      </Card.Section>
      <Stack mt="md">
        <div>
          <Box
            sx={(theme) => ({
              position: "relative",
              height: rem(16),
              borderRadius: theme.radius.sm,
              background: `linear-gradient(90deg, ${theme.colors.red[6]} 0%, ${theme.colors.blue[6]} 50%, ${theme.colors.red[6]} 100%)`,
            })}
          >
            <Box
              sx={(theme) => ({
                position: "absolute",
                top: 0,
                left: `${Math.min(Math.max(50 + deviation, 0), 100)}%`,
                width: rem(8),
                height: rem(24),
                backgroundColor: theme.colors.dark,
                transform: "translate(-50%, -0.25rem)",
                transition: "left 0.5s ease-out",
                borderRadius: theme.radius.sm,
              })}
            />
          </Box>
          <Group position="apart" mt={8}>
            <Text size="sm">
              Потребление: {totalPurchasedConsumption.toFixed(2)} МВт
            </Text>
            <Text size="sm">
              Генерация: {totalPurchasedGeneration.toFixed(2)} МВт
            </Text>
          </Group>
        </div>
        <Box>
          <Text fw={500} component="span">
            Итоговая прибыль:
          </Text>{" "}
          <Text
            component="span"
            color={recalculatedProfit >= 0 ? "green" : "red"}
          >
            {recalculatedProfit.toFixed(2)} ₽
          </Text>
        </Box>
      </Stack>
    </Card>
  );
};
