import { Flex, Loader } from "@mantine/core";
import { Suspense, lazy } from "react";

const DashboardPage = lazy(() =>
  import("./dashboard").then((module) => ({ default: module.DashboardPage }))
);

export const Pages = () => {
  return (
    <Suspense
      fallback={
        <Flex
          sx={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          align="center"
          justify="center"
        >
          <Loader variant="bars" size={50} />
        </Flex>
      }
    >
      <DashboardPage />
    </Suspense>
  );
};
