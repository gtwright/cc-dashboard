import ReactPlayer from "react-player";
import { gql, useQuery } from "@apollo/client";

const videos = [
  { state: "MA", url: "https://www.youtube.com/watch?v=q9AFG6MUepY" },
  { state: "MA", url: "https://www.youtube.com/watch?v=yE0XYILpDOc&t=212" },
  { state: "SC", url: "https://www.youtube.com/watch?v=uytxdWnTrXg" },
  { state: "ID", url: "https://www.youtube.com/watch?v=wo4rAJQWles&t=100" },
];

const pickRandomMediaUrl = (mediaArray) => {
  if (!mediaArray || mediaArray.length == 0) return null;
  const random = Math.floor(Math.random() * mediaArray.length);
  return mediaArray[random].url;
};

const Query = gql`
  query($state: [States!]) {
    culturalMediaItems(where: { states_in: $state }) {
      id
      url
      states
    }
  }
`;

const CultureQuery = ({ stateSelection }) => {
  const { data, loading, error } = useQuery(Query, {
    variables: { state: ["SC"] },
  });
  console.log(data);
  const stateMedia = videos.filter(
    (x) => x.state == stateSelection.abbreviation
  );
  const mediaUrl = pickRandomMediaUrl(stateMedia);
  if (mediaUrl) return <ReactPlayer url={mediaUrl} />;
  return <div>No video</div>;
};

export default CultureQuery;
