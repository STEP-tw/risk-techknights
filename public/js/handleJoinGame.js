const setInnerTextByElementId = function(document, elementId, text) {
  let element = document.getElementById(elementId);
  element.innerText = text;
};

const redirectToWaitingPage = function(location) {
  window.location.href = location;
};

const setInnerTextOfErrorMsg = setInnerTextByElementId.bind(
  null,
  document,
  "errorMsg"
);

const actions = {
  validGameId: redirectToWaitingPage.bind(null, "/waitingPage"),
  invalidGameId: setInnerTextOfErrorMsg.bind(null, "Invalid Game Id"),
  gameStarted: setInnerTextOfErrorMsg.bind(null, "Game Already Started")
};

const validateGameId = function(event) {
  event.preventDefault();
  const gameId = document.getElementById("gameId").value;
  const playerName = document.getElementById("playerName").value;
  fetch("/validateGameId", sendPostRequest({ gameId, playerName }))
    .then(res => res.json())
    .then(data => {
      const currentAction = data.action;
      actions[currentAction]();
    });
};
