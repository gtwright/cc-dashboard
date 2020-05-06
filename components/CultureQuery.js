import { useState } from "react";
import ReactPlayer from "react-player";
import { gql, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import Link from "../components/Link";
import Loading from "../components/Loading";
const d = new Date();
const expires = d.toJSON();

// const pickRandomMediaUrl = (mediaArray) => {
//   if (!mediaArray || mediaArray.length == 0) return null;
//   const random = Math.floor(Math.random() * mediaArray.length);
//   return mediaArray[random].url;
// };

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
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const Query = stateSelection.abbreviation == "US" ? QueryAll : QueryState;

  const { data, loading, error } = useQuery(Query, {
    variables: { state: stateSelection.abbreviation, expires: expires },
    onCompleted: () => {
      const randomIndex = Math.floor(
        Math.random() * data.culturalMediaItems.length
      );
      setMediaIndex(randomIndex);
    },
  });
  const stateMedia = data && data.culturalMediaItems;
  return (
    <div
      suppressHydrationWarning={true}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: 450,
        // width: "100%",
        flexGrow: 1,
        maxWidth: 800,
      }}
    >
      {stateMedia && stateMedia[mediaIndex]?.url && (
        <div
          suppressHydrationWarning={true}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <div
            style={{
              display: !mediaLoaded ? "flex" : "none",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
            <Loading />
          </div>
          <div
            style={{
              display: mediaLoaded ? "flex" : "none",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              // maxHeight: 450,
              position: "relative",
              paddingTop: "56.25%",
            }}
          >
            <ReactPlayer
              playing={false}
              muted={true}
              controls={true}
              onReady={() => {
                setMediaLoaded(true);
              }}
              url={stateMedia[mediaIndex].url}
              height="100%"
              width="100%"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </div>

          {stateMedia.length > 1 && (
            <>
              <Button
                variant="contained"
                color="secondary"
                disableElevation
                onClick={() => {
                  setMediaIndex((mediaIndex + 1) % stateMedia.length);
                  setMediaLoaded(false);
                }}
                style={{ marginTop: 30 }}
              >
                Next, Please!
              </Button>
              <div style={{ fontSize: "0.8em" }}>
                <a href={stateMedia[mediaIndex].url} target="_blank">
                  Link to source
                </a>
                .
              </div>
            </>
          )}
        </div>
      )}
      {!loading && stateMedia.length == 0 && (
        <div suppressHydrationWarning={true}>
          Looks like we don't have any media for {stateSelection.name}. Want to{" "}
          <Link href="/submit">submit something</Link>?
        </div>
      )}
    </div>
  );
};

export default CultureQuery;
