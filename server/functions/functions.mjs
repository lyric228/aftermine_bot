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


export function getCurrentDate() {
  return new Date().toLocaleString().replace(/[а-яА-Яa-zA-Z]/g, "");
}

export function splitStringIntoList(string, maxLength = 250) {
    const list = [];
    const words = string.split(' ');
    let currentString = '';

    for (const word of words) {
        if (currentString.length + word.length + 1 > maxLength) {
            list.push(currentString);
            currentString = word;
        } else {
            if (currentString.length > 0) currentString += " ";
            currentString += word;
        }
    }

    if (currentString.length > 0) list.push(currentString);

    return list;
}
