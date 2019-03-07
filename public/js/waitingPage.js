const displayGameId = function (document) {
  const { game } = parseCookies(document.cookie);
  setElementInnerText(document.getElementById('game-id'), game);
};

const isAllPlayersJoined = function (totalPlayers, joinedPlayers, interval) {
  if (totalPlayers == joinedPlayers.length) {
    clearInterval(interval);
    redirect('game');
  }
};

const addPlayer = function (player) {
  const { name, color } = player;
  let newTr = createElement(document, 'tr');
  newTr.innerHTML = `<td style='background:${color}'>${name}</td>`;
  document.getElementById('players-list').appendChild(newTr);
};

const updateList = function (document) {
  const interval = setInterval(() => {
    fetch('/updateWaitingList')
      .then(res => res.json())
      .then(data => {
        setElementInnerHTML(document.getElementById('players-list'), EMPTY_STRING);
        const { joinedPlayers, totalPlayers } = data;
        joinedPlayers.forEach(player => addPlayer(player));
        isAllPlayersJoined(totalPlayers, joinedPlayers, interval);
      });
  }, 1000);
};

window.onload = () => {
  displayGameId(document);
  updateList(document);
};
