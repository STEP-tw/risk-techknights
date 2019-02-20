window.onload = function() {
  let gameId = document.getElementById("gameId");
  let { game } = parseCookies(document.cookie);
  gameId.innerText = `Game  Id: ${game}`;
};
