import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Pages } from "~/pages";

export const App = () => {
  return (
    <MantineProvider withNormalizeCSS>
      <Pages />
      <Notifications />
    </MantineProvider>
  );
};
