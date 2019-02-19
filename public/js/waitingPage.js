const updateList = function() {
  let game = document.cookie.split("=")[1];
  document.getElementById("game-id").innerText = game;
  const interval = setInterval(() => {
    // let game = document.cookie.split("=")[1];
    // document.getElementById("game-id").innerText = game;
    fetch("/updateWaitingList", {
      method: "POST",
      body: `game=${game}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(response => {
      if (response.url.match(/game\.html/)) {
        clearInterval(interval);
        window.location.href = response.url;
      }
    });
  }, 1000);
};

window.onload = updateList;
