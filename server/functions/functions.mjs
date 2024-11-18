export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function dateDiff(date1, date2 = new Date()) {
  if (date1 === null) date1 = new Date();
  if (date2 === null) date2 = new Date();
  const diff = Math.abs(date2.getTime() - date1.getTime());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    d: days,
    h: hours,
    m: minutes,
    s: seconds,
  };
}