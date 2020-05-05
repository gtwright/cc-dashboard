import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "../components/Link";
import Layout from "../components/Layout";

function About() {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            About {process.env.SITE_NAME}
          </Typography>
          <div>
            If you're like us, you're obsessively checking dashboards to get
            updates on COVID19. Might as well get a little culture with that
            data. Pick a state and you'll get a video along with your COVID19
            updates. Stay healthy!
          </div>
        </Box>
      </Container>
    </Layout>
  );
}

export default About;
