export const MAP_SIZE = 432;
export const DEFAULT_SPEED = 200;

export const genRandomNum = (limit: number): number => {
  return Math.floor(Math.random() * (limit));
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
