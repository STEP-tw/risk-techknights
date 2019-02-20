const updateList = function() {
  const interval = setInterval(() => {
    let { game } = parseCookies(document.cookie);
    document.getElementById("game-id").innerText = game;
    fetch("/updateWaitingList", { method: "POST" }).then(response => {
      if (response.url.match(/game\.html/)) {
        clearInterval(interval);
        window.location.href = response.url;
      }
    });
  }, 1000);
};

window.onload = updateList;
