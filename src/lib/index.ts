const min = 0;
const max = 480;

export const genRandomNum = () => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
