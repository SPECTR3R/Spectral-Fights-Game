let whatTimeIsIt = (angle) => {
  let hour = angle < 30 ? '12' : Math.floor((1 / 30) * angle).toString();
  let minutes = Math.floor(2 * (angle % 30)).toString();
  hour = hour.length === 1 ? `0${hour}` : `${hour}`;
  minutes = minutes.length === 1 ? `0${minutes}` : `${minutes}`;
  return `${hour}:${minutes}`;
};
deg=40
console.log();
