import { Container, Title, createStyles, rem } from "@mantine/core";
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
        <Title order={2}>{APP_NAME}</Title>
      </Container>
    </header>
  );
};
