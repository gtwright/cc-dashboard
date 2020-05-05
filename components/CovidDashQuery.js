import React from "react";
import { gql, useQuery } from "@apollo/client";
import Loading from "../components/Loading";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
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
    covidUSCurrent @rest(type: "US", path: "us/current.json") {
      positive
    }
    covidStateHistory(state: $stateInput)
      @rest(type: "State", path: "states/:state/daily.json") {
      date
      state
      positive
      totalTestResults
      death
      hospitalized
    }
  }
`;

const QueryAll = gql`
  query {
    covidUSCurrent @rest(type: "US", path: "us/current.json") {
      positive
    }
    covidStateHistory @rest(type: "State", path: "states/daily.json") {
      date
      state
      positive
      totalTestResults
      death
      hospitalized
    }
  }
`;

const CovidDashQuery = ({ stateSelection }) => {
  const Query = stateSelection.abbreviation == "US" ? QueryAll : QueryState;

  const { data, loading, error } = useQuery(Query, {
    variables: { stateInput: stateSelection.abbreviation },
  });
  return (
    <div>
      {data && (
        <div>
          <div
            style={{ display: "flex", justifyContent: "center", padding: 20 }}
          >
            <Typography component="h2" variant="h3">
              Results for {stateSelection.name}
            </Typography>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography component="h2" variant="h3">
                      Positive Cases
                    </Typography>
                    <VictoryChart>
                      <VictoryLine
                        data={formatResponseDate(data.covidStateHistory)}
                        // animate={{
                        //   duration: 2000,
                        //   onLoad: { duration: 1000 },
                        // }}
                        x="formattedDate"
                        y="positive"
                        sortKey="formattedDate"
                        groupComponent={
                          <VictoryClipContainer clipId="covidStateHistory" />
                        }
                      />
                      <VictoryAxis tickCount={4} />
                      <VictoryAxis
                        dependentAxis
                        tickCount={4}
                        tickFormat={(t) => `${Math.round(t / 1000)}k`}
                      />
                    </VictoryChart>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography component="h2" variant="h3">
                      Deaths
                    </Typography>
                    <VictoryChart>
                      <VictoryLine
                        data={formatResponseDate(data.covidStateHistory)}
                        // animate={{
                        //   duration: 2000,
                        //   onLoad: { duration: 1000 },
                        // }}
                        x="formattedDate"
                        y="death"
                        sortKey="formattedDate"
                        groupComponent={
                          <VictoryClipContainer clipId="covidStateHistory" />
                        }
                      />
                    </VictoryChart>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography component="h2" variant="h3">
                      Total Test Results
                    </Typography>
                    <VictoryChart>
                      <VictoryLine
                        data={formatResponseDate(data.covidStateHistory)}
                        // animate={{
                        //   duration: 2000,
                        //   onLoad: { duration: 1000 },
                        // }}
                        x="formattedDate"
                        y="totalTestResults"
                        sortKey="formattedDate"
                        groupComponent={
                          <VictoryClipContainer clipId="covidStateHistory" />
                        }
                      />
                    </VictoryChart>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </div>
      )}
    </div>
  );
};

export default CovidDashQuery;
