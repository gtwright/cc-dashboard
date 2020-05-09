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
          <Typography gutterBottom>
            If you're like us, you're obsessively checking dashboards to get
            updates on COVID19. Might as well get a little culture with that
            data. Pick a state and you'll get a video from the same state along
            with your COVID19 updates.
          </Typography>
          <Typography gutterBottom>
            <Link href="/submit">Please submit more media</Link> for us to
            share. We're particularly interested in videos that have been
            created during the pandemic, but we also welcome videos of music,
            theater, dance, and other cultural experiences that might bring you
            comfort, meaning, or distraction at this time.
          </Typography>
          <Typography gutterBottom>Stay safe!</Typography>
        </Box>
      </Container>
    </Layout>
  );
}

export default About;
