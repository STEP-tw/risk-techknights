const setInnerTextByElementId = function(document, elementId, text) {
  let element = document.getElementById(elementId);
  element.innerText = text;
};

const getElementValueById = function(document, elementId) {
  return document.getElementById(elementId).value;
};

const redirect = function(location) {
  window.location = location;
};

const setInnerTextOfErrorMsg = setInnerTextByElementId.bind(
  null,
  document,
  "errorMsg"
);

const actions = {
  validGameId: redirect.bind(null, "/waitingPage.html"),
  invalidGameId: setInnerTextOfErrorMsg.bind(null, "Invalid Game Id"),
  gameStarted: setInnerTextOfErrorMsg.bind(null, "Game Already Started")
};

const validateGameId = function(event) {
  event.preventDefault();

  const gameId = getElementValueById(document, "gameId");
  const playerName = getElementValueById(document, "playerName");
  fetch("/validateGameId", {
    method: "POST",
    body: `gameId=${gameId}&playerName=${playerName}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(res => res.json())
    .then(data => {
      actions[data.action]();
    });
};
