window.onload = function() {
  let gameId = document.getElementById("gameId");
  gameId.innerText = `Game  Id: ${document.cookie.split("=")[1]}`;
};
