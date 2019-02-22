const startFortify = function (event) {
  const selectedTerritory = event.target;
  const territoryName = selectedTerritory.parentElement.id;
  fetch('/fortify', sendPostRequest({ territoryName }))
    .then(res => res.json()).then(fortifyingDetails => {
      console.log(fortifyingDetails);
      if (fortifyingDetails.msg) {
        return document.getElementById('instruction').innerText = fortifyingDetails.msg;
      }
      selectedTerritory.style.fill = "black";
      displayFortifySection(fortifyingDetails.sourceTerritory);
    });
}

const displayFortifySection = function (territory) {
  const unit = territory.militaryUnits - 1;
  document.getElementById('selectMilitaryUnit').style.display = 'block';
  document.getElementById('number').value = unit;
  document.getElementById('hdnNumber').value = unit;
  document.getElementById('instruction').innerText = 'fortifying...'
}

const increaseValue = function () {
  const maxValue = parseInt(document.getElementById('hdnNumber').value);
  let value = parseInt(document.getElementById('number').value);
  value++;
  value > maxValue ? --value : value;
  document.getElementById('number').value = value;
}

const decreaseValue = function () {
  let value = parseInt(document.getElementById('number').value);
  value--;
  value < 0 ? ++value : value;
  document.getElementById('number').value = value;
}

const fortifyComplete = function () {
  fetch('/fortifyComplete', sendPostRequest({
    militaryUnits: document.getElementById('number').value
  }));
  document.getElementById('number').value = 0;
  document.getElementById('hdnNumber').value = 0;
  document.getElementById('selectMilitaryUnit').style.display = 'none';
  document.getElementById('instruction').innerText = 'fortify complete'
}

const changeToFortifyPhase = function () {
  fetch('/changeToFortifyPhase')
}