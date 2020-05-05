import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { withApollo } from "../utils/apollo";
import Layout from "../components/Layout";
import CovidDashQuery from "../components/CovidDashQuery";
import CultureQuery from "../components/CultureQuery";
import StateSelect from "../components/StateSelect";
import { withTheme } from "@material-ui/core/styles";
import Link from "../components/Link";
function Index({ theme }) {
  const [stateSelection, setStateSelection] = useState({
    name: "All United States",
    abbreviation: "US",
  });

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
          // backgroundColor: theme.palette.grey[300],
        }}
      >
        <Box
          my={2}
          suppressHydrationWarning={true}
          width="100%"
          style={{ display: "flex", justifyContent: "center" }}
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
          // backgroundColor: theme.palette.grey[300],
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
