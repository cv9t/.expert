import { Paper, Text, Title, createStyles, rem } from "@mantine/core";
import { ReactNode } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },

  title: {
    marginBottom: theme.spacing.sm,
  },

  empty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: rem(120),
    color: theme.colors.gray[6],
    backgroundColor: theme.colors.gray[1],
  },
}));

type SectionProps = {
  title: string;
  children: ReactNode;
  empty?: ReactNode;
};

export const Section = ({ title, children, empty }: SectionProps) => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Title className={classes.title} order={4}>
        {title}
      </Title>
      <Paper
        className={empty ? classes.empty : ""}
        withBorder
        p="md"
        radius="lg"
      >
        {empty ? <Text size="xl">{empty}</Text> : children}
      </Paper>
    </div>
  );
};
