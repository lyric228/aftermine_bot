const fs = require("fs");

let blacklist = ["uzerchik", "Milaina", "Диего_санчез", "TimohaFriend638", "menvixss", "pro7070", "affa", "alibaba12", "reizor", "menesixx"];
function saveBlacklist(blacklist) {
  const text = blacklist.join("\n");
  fs.writeFileSync("blacklist.txt", text);
}

function loadBlacklist() {
  try {
    const text = fs.readFileSync("blacklist.txt", "utf8");
    return text.split("\n");
  } catch (err) {
    if (err.code === "ENOENT") return [];
  }
}

console.log(loadBlacklist());
