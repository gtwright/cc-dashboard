import React from "react";
import { gql, useQuery } from "@apollo/client";
import Loading from "../components/Loading";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryClipContainer,
  VictoryTheme,
} from "victory";

function formatNumber(num) {
  if (!num) return "No Data";
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

const formatResponseDate = (response) => {
  return response.map((x) => {
    const d = x.date.toString();
    const formattedDate =
      d.slice(0, 4) + "-" + d.slice(4, 6) + "-" + d.slice(6);
    return { ...x, formattedDate };
  });
};

const QueryState = gql`
  query {
    covidHistory(state: $stateInput)
      @rest(type: "State", path: "states/:state/daily.json") {
      date
      state
      positive
      totalTestResults
      death
      hospitalized
      lastUpdateEt
    }
  }
`;

const QueryAll = gql`
  query {
    covidHistory @rest(type: "US", path: "us/daily.json") {
      date
      positive
      totalTestResults
      death
      hospitalized
      lastUpdateEt
    }
  }
`;

const CovidDashQuery = ({ stateSelection }) => {
  const Query = stateSelection.abbreviation == "US" ? QueryAll : QueryState;

  const { data, loading, error } = useQuery(Query, {
    variables: { stateInput: stateSelection.abbreviation },
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {data && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Typography component="h2" variant="h3">
              COVID19 Data for {stateSelection.name || "All United States"}
            </Typography>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <Grid container spacing={3}>
              <Grid item md={7} xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary">
                      Total Cases Over Time
                    </Typography>

                    <VictoryChart
                      padding={{ top: 10, bottom: 50, left: 50, right: 50 }}
                      domainPadding={{ y: 30, x: 10 }}
                      containerComponent={
                        <VictoryVoronoiContainer
                          labels={({ datum }) =>
                            `${moment(datum.formattedDate).format(
                              "MMM D"
                            )}: ${formatNumber(datum.positive)}`
                          }
                          labelComponent={
                            <VictoryTooltip
                              constrainToVisibleArea
                              cornerRadius={0}
                              flyoutStyle={{ fill: "white" }}
                            />
                          }
                        />
                      }
                    >
                      <VictoryLine
                        data={formatResponseDate(data.covidHistory)}
                        x="formattedDate"
                        y="positive"
                        sortKey="formattedDate"
                        groupComponent={
                          <VictoryClipContainer clipId="covidHistory" />
                        }
                        style={{
                          data: {
                            stroke: "tomato",
                            strokeWidth: ({ active }) => (active ? 4 : 2),
                          },
                          //   labels: { fill: "tomato" },
                        }}
                        labelComponent={
                          <VictoryTooltip
                            style={{ fontSize: 10 }}
                            renderInPortal
                          />
                        }
                      />
                      <VictoryAxis
                        tickCount={3}
                        tickFormat={(t) => moment(t).format("MMM D")}
                      />
                      <VictoryAxis
                        dependentAxis
                        tickCount={4}
                        tickFormat={(t) =>
                          t > 1000
                            ? `${formatNumber(Math.round(t / 1000))}k`
                            : t
                        }
                      />
                    </VictoryChart>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item md={5} xs={12}>
                <Card variant="outlined" style={{ height: "100%" }}>
                  <CardContent
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <Typography color="textSecondary">Total Cases</Typography>
                      <Typography component="h2" variant="h4" gutterBottom>
                        {formatNumber(data.covidHistory[0].positive)} (
                        {formatNumber(
                          data.covidHistory[0].positive -
                            data.covidHistory[1].positive
                        )}
                        )
                      </Typography>
                      <Typography color="textSecondary">
                        Hospitalized
                      </Typography>
                      <Typography component="h2" variant="h4" gutterBottom>
                        {formatNumber(data.covidHistory[0].hospitalized)}
                      </Typography>
                      <Typography color="textSecondary">Deaths</Typography>
                      <Typography component="h2" variant="h4" gutterBottom>
                        {formatNumber(data.covidHistory[0].death)}
                      </Typography>
                      <Typography color="textSecondary">Total Tests</Typography>
                      <Typography component="h2" variant="h4" gutterBottom>
                        {formatNumber(data.covidHistory[0].totalTestResults)} (
                        {formatNumber(
                          data.covidHistory[0].totalTestResults -
                            data.covidHistory[1].totalTestResults
                        )}
                        )
                      </Typography>
                    </div>
                    {data.covidHistory[0].lastUpdateEt && (
                      <div>
                        as of{" "}
                        {moment(
                          data.covidHistory[0].lastUpdateEt,
                          "MM/DD/YYYY"
                        ).format("MMM D")}
                        {/* {data.covidHistory[0].lastUpdateEt} */}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </div>
  );
};

export default CovidDashQuery;
