const actions = {
  validGameId: redirect.bind(null, '/waitingPage'),
  invalidGameId: setElementInnerText.bind(null, document.getElementById('errorMsg'), 'Invalid Game Id'),
  gameStarted: setElementInnerText.bind(null, document.getElementById('errorMsg'), 'Game Already Started')
};

const validateGameId = function (event) {
  event.preventDefault();
  const gameId = document.getElementById('gameId').value;
  const playerName = document.getElementById('playerName').value;
  fetch('/validateGameId', sendPostRequest({ gameId, playerName }))
    .then(res => res.json())
    .then(data => {
      const currentAction = data.action;
      actions[currentAction]();
    });
};
