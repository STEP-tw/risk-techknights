const updateList = function() {
  const interval = setInterval(() => {
    let game = document.cookie.split("=")[1];

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
