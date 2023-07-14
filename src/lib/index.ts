export const MAP_SIZE = 432;

export const genRandomNum = () => {
  return Math.floor(Math.random() * (MAP_SIZE));
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
