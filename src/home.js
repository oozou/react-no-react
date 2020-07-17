console.log("home.js");

const title = document.getElementById("home");

let cyan = true;

setInterval(() => {
  title.style.color = cyan ? "cyan" : "black";
  cyan = !cyan;
}, 1000);
