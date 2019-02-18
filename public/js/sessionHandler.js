window.onload = function() {
  let gameId = document.getElementById("gameId");
  console.log(document.cookie);
  gameId.innerText = `Game  Id: ${document.cookie.split("=")[1]}`;
};
