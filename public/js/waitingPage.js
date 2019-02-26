const displayGameId = function (document) {
  let { game } = parseCookies(document.cookie);
  document.getElementById('game-id').innerText = game;
};

const addPlayer = function (player) {
  const { name, color } = player;
  let newTr = document.createElement('tr');
  newTr.innerHTML = `<td style='background:${color}'>${name}</td>`;
  document.getElementById('players-list').appendChild(newTr);
}

const isAllPlayersJoined = function(totalPlayers, joinedPlayers, interval) {
  if (totalPlayers == joinedPlayers.length) {
    clearInterval(interval);
    window.location.href = 'game.html';
  }
}

const updateList = function (document) {
  const interval = setInterval(() => {
    fetch('/updateWaitingList')
      .then(res => res.json())
      .then(data => {
        document.getElementById('players-list').innerHTML = '';
        const { joinedPlayers, totalPlayers } = data;
        joinedPlayers.forEach(player => addPlayer(player))
        isAllPlayersJoined(totalPlayers, joinedPlayers, interval);
      });
  }, 1000);
};

window.onload = () => {
  displayGameId(document);
  updateList(document);
};
