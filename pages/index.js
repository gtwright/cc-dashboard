import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { withApollo } from "../utils/apollo";
import Layout from "../components/Layout";
import CovidDashQuery from "../components/CovidDashQuery";
import CultureQuery from "../components/CultureQuery";
import StateSelect from "../components/StateSelect";

function Index() {
  const [stateSelection, setStateSelection] = useState({
    name: "Massachusetts",
    abbreviation: "MA",
  });

  const handleChange = (v) => {
    setStateSelection(v);
  };

  return (
    <Layout>
      <Container
        style={{
          minHeight: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box my={2} suppressHydrationWarning={true} width="100%">
          <StateSelect
            stateSelection={stateSelection}
            handleChange={handleChange}
          />
          <CultureQuery stateSelection={stateSelection} />
          <CovidDashQuery stateSelection={stateSelection} />
        </Box>
      </Container>
    </Layout>
  );
}

export default withApollo({ ssr: true })(Index);
