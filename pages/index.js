import React, { useState, useEffect, useRef } from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { withApollo } from "../utils/apollo";
import Layout from "../components/Layout";
import CovidDashQuery from "../components/CovidDashQuery";
import CultureQuery from "../components/CultureQuery";
import StateSelect from "../components/StateSelect";
import { withTheme } from "@material-ui/core/styles";
import Link from "../components/Link";
import { useRouter } from "next/router";
import statesJson from "../src/states.json";

function Index({ theme }) {
  const router = useRouter();
  const { state, id } = router.query;

  const [stateSelection, setStateSelection] = useState({
    abbreviation: "US",
    name: "All United States",
  });

  useEffect(() => {
    //on render, check query params for state
    const stateObj =
      statesJson.filter((obj) => {
        return obj.abbreviation == state;
      })[0] || null;
    // Always do navigations after the first render
    if (stateObj) setStateSelection(stateObj);
  }, []);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      const stateObj = statesJson.filter((obj) => {
        return obj.abbreviation == stateSelection.abbreviation;
      })[0];
      router.push(`/?state=${stateObj.abbreviation}`, undefined, {
        shallow: true,
      });
    } else didMountRef.current = true;
  }, [stateSelection]);

  const handleChange = (v) => {
    setStateSelection(v);
  };

  return (
    <Layout>
      <Container
        maxWidth={false}
        style={{
          minHeight: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.grey[300],
        }}
      >
        <Box
          my={2}
          suppressHydrationWarning={true}
          width="100%"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 16,
            paddingBottom: 6,
          }}
        >
          <StateSelect
            stateSelection={stateSelection}
            handleChange={handleChange}
          />
          <div style={{ fontSize: "0.8em" }}>
            <Link href="/about">What's this about?</Link>
          </div>
        </Box>
      </Container>
      <Container
        style={{
          minHeight: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          my={2}
          suppressHydrationWarning={true}
          width="100%"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CultureQuery stateSelection={stateSelection} />
        </Box>
      </Container>
      <Container
        style={{
          minHeight: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          my={2}
          suppressHydrationWarning={true}
          width="100%"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <CovidDashQuery stateSelection={stateSelection} />
        </Box>
      </Container>
    </Layout>
  );
}

export default withApollo({ ssr: true })(withTheme(Index));
