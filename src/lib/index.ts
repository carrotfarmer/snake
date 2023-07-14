const min = 0;
const max = 480;

export const genRandomNum = () => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const setLocalStorage = (val: number): void => {
  window.localStorage.setItem("highScore", val.toString());
}

export const getLocalStorage = ()  => {
  const item = window.localStorage.getItem("highScore")
  let val = 0;

  if (item) {
    val = Number(item);
  }

  return val
}
