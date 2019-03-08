const displayReinforceSection = function (player) {
  const unit = player.militaryUnits;
  setElementDisplay(document.getElementById('selectMilitaryUnit'), DISPLAY_BLOCK);
  setElementInnerText(document.getElementById('number'), unit);
  document.getElementById('hdnNumber').value = unit;
};

const startReinforcement = function (event) {
  const selectedTerritory = event.target;
  const territoryName = selectedTerritory.parentElement.id;
  fetch('/reinforcement', sendPostRequest({ territoryName }))
    .then(res => res.json())
    .then(reinforcementDetails => displayReinforceSection(reinforcementDetails.player));
};

const reinforcementComplete = function () {
  const militaryUnits = +document.getElementById('number').innerText;
  fetch('/reinforcementComplete', sendPostRequest({ militaryUnits }))
    .then(res => res.json())
    .then(player => {
      hideElement(document.getElementById('selectMilitaryUnit'));
      if (player.militaryUnits < 1 && player.phase == 2) {
        fetch('/changeTurnAndPhase');
      }
      if (player.militaryUnits < 1 && player.phase == 3) {
        nextPhase();
      }
    });
};
