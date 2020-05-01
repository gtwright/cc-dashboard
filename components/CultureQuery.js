import ReactPlayer from "react-player";

const videos = [
  { state: "MA", url: "https://www.youtube.com/watch?v=q9AFG6MUepY" },
  { state: "MA", url: "https://www.youtube.com/watch?v=yE0XYILpDOc" },
  { state: "SC", url: "https://www.youtube.com/watch?v=uytxdWnTrXg" },
];

const pickRandomMediaUrl = (mediaArray) => {
  if (!mediaArray || mediaArray.length == 0) return null;
  const random = Math.floor(Math.random() * mediaArray.length);
  return mediaArray[random].url;
};

const CultureQuery = ({ stateSelection }) => {
  const stateMedia = videos.filter(
    (x) => x.state == stateSelection.abbreviation
  );
  const mediaUrl = pickRandomMediaUrl(stateMedia);
  if (mediaUrl) return <ReactPlayer url={mediaUrl} />;
  return <div>No results</div>;
};

export default CultureQuery;
