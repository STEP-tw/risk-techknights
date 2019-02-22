const displayGameId = function(document) {
  let { game } = parseCookies(document.cookie);
  document.getElementById("game-id").innerText = game;
};

const addNewPlayerInList = function(document, list, player) {
  let { name, color } = player;
  let newTr = document.createElement("tr");
  newTr.innerHTML = `<td>${name}</td><td style="background:${color}"></td>`;

  list.appendChild(newTr);
};

const getPlayerById = function(players, id) {
  return players.filter(player => player.id == id)[0];
};

const updateList = function(document) {
  const interval = setInterval(() => {
    fetch("/updateWaitingList")
      .then(res => res.json())
      .then(data => {
        let playerList = document.getElementById("players-list");
        let totalJoinedPlayers = playerList.getElementsByTagName("tr").length;
        const { players, totalPlayers } = data;
        if (players.length > totalJoinedPlayers) {
          const newPlayer = getPlayerById(players, totalJoinedPlayers + 1);
          addNewPlayerInList(document, playerList, newPlayer);
        }
        if (totalPlayers == totalJoinedPlayers) {
          clearInterval(interval);
          window.location.href = "game";
        }
      });
  }, 500);
};
window.onload = () => {
  displayGameId(document);
  updateList(document);
};
