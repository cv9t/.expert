import {
  Container,
  Group,
  Title,
  createStyles,
  rem,
  Text,
} from "@mantine/core";
import { APP_NAME } from "~/shared/config/env";

const useStyles = createStyles((theme) => ({
  root: {
    width: "100%",
    // TODO: Вынести бы в theme
    height: rem(80),
    borderBottom: `1px solid ${theme.colors.gray[2]}`,
  },

  container: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
}));

export const Header = () => {
  const { classes } = useStyles();

  return (
    <header className={classes.root}>
      <Container className={classes.container} fluid>
        <Group position="apart" w="100%">
          <Title order={2}>{APP_NAME}</Title>
          {/* TODO: Вынести в shared/ui */}
          <Text
            component="a"
            href="https://docs.google.com/document/d/1_N8XPg8f4AzBZCfgnfySA_WTh_Qw4mCOtp3V4GGp-CI/edit?usp=sharing"
            target="_blank"
            c="dimmed"
            fw={500}
            sx={(theme) => ({
              cursor: "pointer",
              "&:hover": {
                color: theme.colors.dark,
              },
            })}
          >
            Документация
          </Text>
        </Group>
      </Container>
    </header>
  );
};
