import { useState } from "react";
import ReactPlayer from "react-player";
import { gql, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import Link from "../components/Link";

const d = new Date();
const expires = d.toJSON();

const pickRandomMediaUrl = (mediaArray) => {
  if (!mediaArray || mediaArray.length == 0) return null;
  const random = Math.floor(Math.random() * mediaArray.length);
  return mediaArray[random].url;
};

const QueryState = gql`
  query($state: States, $expires: Date) {
    culturalMediaItems(
      where: {
        AND: [
          { states: $state }
          { OR: [{ expires_gte: $expires }, { expires: null }] }
        ]
      }
    ) {
      id
      url
      states
      stage
    }
  }
`;

const QueryAll = gql`
  query($expires: Date) {
    culturalMediaItems(
      where: { AND: [{ OR: [{ expires_gte: $expires }, { expires: null }] }] }
    ) {
      id
      url
      states
      stage
    }
  }
`;

const CultureQuery = ({ stateSelection }) => {
  const [mediaIndex, setMediaIndex] = useState(0);
  const Query = stateSelection.abbreviation == "US" ? QueryAll : QueryState;

  const { data, loading, error } = useQuery(Query, {
    variables: { state: stateSelection.abbreviation, expires: expires },
    onCompleted: () => {
      const randomIndex = Math.floor(
        Math.random() * data.culturalMediaItems.length
      );
      setMediaIndex(randomIndex);
      console.log(randomIndex);
    },
  });
  const stateMedia = data && data.culturalMediaItems;
  console.log(data, stateMedia);

  return (
    <div
      style={{
        minHeight: 300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {stateMedia && stateMedia[mediaIndex]?.url ? (
        <div
          suppressHydrationWarning={true}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ReactPlayer
            playing
            muted={false}
            controls={true}
            url={stateMedia[mediaIndex].url}
          />
          <div style={{ fontSize: "0.8em" }}>
            <a href={stateMedia[mediaIndex].url} target="_blank">
              Link to source
            </a>
            .
          </div>
          {stateMedia.length > 1 && (
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              onClick={() => {
                setMediaIndex((mediaIndex + 1) % stateMedia.length);
              }}
              style={{ marginTop: 30 }}
            >
              Next, Please!
            </Button>
          )}
        </div>
      ) : (
        <div suppressHydrationWarning={true}>
          Looks like we don't have any media for {stateSelection.name}. Want to{" "}
          <Link href="/submit">submit something</Link>?
        </div>
      )}
    </div>
  );
};

export default CultureQuery;
