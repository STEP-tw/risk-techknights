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
  invalidPlayerId: setInnerTextOfErrorMsg.bind(null, "invalid Player Id")
};

const validateGameDetails = function(event) {
  event.preventDefault();
  const gameId = document.getElementById("gameId").value;
  const playerId = document.getElementById("playerId").value;
  fetch("/loadSavedGame", sendPostRequest({ gameId, playerId }))
    .then(res => res.json())
    .then(data => {
      const currentAction = data.action;
      actions[currentAction]();
    });
};
