import { useState } from "react";
import ReactPlayer from "react-player";
import { gql, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";

const d = new Date();
const expires = d.toJSON();

const pickRandomMediaUrl = (mediaArray) => {
  if (!mediaArray || mediaArray.length == 0) return null;
  const random = Math.floor(Math.random() * mediaArray.length);
  return mediaArray[random].url;
};

const Query = gql`
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

const CultureQuery = ({ stateSelection }) => {
  const [mediaIndex, setMediaIndex] = useState(0);

  const { data, loading, error } = useQuery(Query, {
    variables: { state: stateSelection.abbreviation, expires: expires },
    onCompleted: () => {
      setMediaIndex(Math.floor(Math.random() * data.culturalMediaItems.length));
    },
  });
  const stateMedia = data && data.culturalMediaItems;

  const mediaUrl = pickRandomMediaUrl(stateMedia);
  return (
    <div style={{ minHeight: 300 }}>
      {mediaUrl ? (
        <div suppressHydrationWarning={true}>
          <ReactPlayer
            playing
            muted
            controls={true}
            url={stateMedia[mediaIndex].url}
          />
          <Button
            onClick={() => {
              setMediaIndex((mediaIndex + 1) % stateMedia.length);
            }}
          >
            Show me another!
          </Button>
        </div>
      ) : (
        <div suppressHydrationWarning={true}>No video</div>
      )}
    </div>
  );
};

export default CultureQuery;
