const increaseValue = function () {
  const maxValue = parseInt(document.getElementById('hdnNumber').value);
  let value = parseInt(document.getElementById('number').innerText);
  value++;
  value > maxValue ? --value : value;
  setElementInnerText(document.getElementById('number'), value);
};

const decreaseValue = function () {
  let value = parseInt(document.getElementById('number').innerText);
  value--;
  value < 0 ? ++value : value;
  setElementInnerText(document.getElementById('number'), value);
};

const displayFortifySection = function (territory) {
  const unit = territory.militaryUnits - 1;
  setElementDisplay(document.getElementById('selectMilitaryUnit'), DISPLAY_BLOCK);
  setElementInnerText(document.getElementById('number'), unit);
  document.getElementById('hdnNumber').value = unit;
};

const startFortify = function (event) {
  const selectedTerritory = event.target;
  const territoryName = selectedTerritory.parentElement.id;
  fetch('/fortify', sendPostRequest({ territoryName }))
    .then(res => res.json())
    .then(fortifyingDetails => {
      displayFortifySection(fortifyingDetails.sourceTerritory);
    });
};

const fortifyComplete = function () {
  const militaryUnits = document.getElementById('number').innerText;
  fetch('/fortifyComplete', sendPostRequest({ militaryUnits }));
  document.getElementById('number').value = INITIAL_MILITARY_UNIT;
}