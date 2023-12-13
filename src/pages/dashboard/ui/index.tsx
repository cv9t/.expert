import { AppShell, Grid, rem, Stack } from "@mantine/core";
import { Section } from "./section";
import { UploadForecast } from "~/features/upload-forecast";
import { useUnit } from "effector-react";
import { forecastModel } from "~/entities/forecast";
import { TeamCard, teamModel } from "~/entities/team";
import { AddTeam } from "~/features/add-team";
import { AddPurchase } from "~/features/add-purchase";
import { Header } from "~/widgets/header";
import { Page } from "~/shared/ui";
import { ReactNode } from "react";
// TODO: Обернуть бы в lazy
import { ConsumptionChart } from "~/widgets/consumption-chart";
// TODO: Обернуть бы в lazy
import { GenerationChart } from "~/widgets/generation-chart";

const EMPTY_SECTION = "Для данной секции необходим файл с прогнозами";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <AppShell
      header={<Header />}
      styles={{
        main: {
          // INFO: Сомнительно, но окэй (1px - погрешность)
          minHeight: `calc(100vh - ${rem(81)})`,
          paddingTop: rem(40),
          paddingBottom: rem(40),
        },
      }}
    >
      {children}
    </AppShell>
  );
};

export const DashboardPage = () => {
  const { teams, forecastSpecified } = useUnit({
    forecastSpecified: forecastModel.$forecastSpecified,
    teams: teamModel.$teams,
  });

  const atLeastOneTeam = teams.length > 0;
  const sectionEmpty = !forecastSpecified && EMPTY_SECTION;

  return (
    <Layout>
      <Page title="Панель">
        <Grid>
          <Grid.Col span={6}>
            <Grid>
              <Grid.Col>
                <Section title="Загрузка прогнозов">
                  <UploadForecast />
                </Section>
              </Grid.Col>
              <Grid.Col>
                <Section title="Аукцион" empty={sectionEmpty}>
                  <Grid>
                    <Grid.Col>
                      <Stack>
                        <AddTeam />
                        {atLeastOneTeam && <AddPurchase />}
                      </Stack>
                    </Grid.Col>
                    {atLeastOneTeam && (
                      <Grid.Col>
                        <Grid>
                          {teams.map((team) => (
                            <Grid.Col key={team.id} span={4}>
                              <TeamCard team={team} />
                            </Grid.Col>
                          ))}
                        </Grid>
                      </Grid.Col>
                    )}
                  </Grid>
                </Section>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={6}>
            <Grid>
              <Grid.Col>
                <Section
                  title="График реального потребления"
                  empty={sectionEmpty}
                >
                  <ConsumptionChart />
                </Section>
              </Grid.Col>
              <Grid.Col>
                <Section title="График реальной генерации" empty={sectionEmpty}>
                  <GenerationChart />
                </Section>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Page>
    </Layout>
  );
};
