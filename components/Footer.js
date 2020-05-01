import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

export default function Footer() {
  return (
    <Grid container>
      <Grid
        item
        sm={12}
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        <div>
          {" "}
          COVID data from the{" "}
          <a target="_blank" href="https://covidtracking.com/data">
            COVID Tracking Project
          </a>{" "}
          API
        </div>
      </Grid>
    </Grid>
  );
}
