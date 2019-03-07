const hideAttackAgainButton = function (attackerMilitary, defendingMilitary) {
  if (attackerMilitary < 2 || defendingMilitary < 1) {
    hideElement(document.getElementById('btnAttackAgain'));
  }
}

const displayContender = function (battleDetails) {
  const { attackerName, defenderName, attackerMilitary, defendingMilitary,
    attackingTerritory, defendingTerritory } = battleDetails;
  setElementInnerText(document.getElementById('attackerName'), attackerName);
  setElementInnerText(document.getElementById('defenderName'), defenderName);
  setElementInnerText(document.getElementById('attackingTerritory'), attackingTerritory);
  setElementInnerText(document.getElementById('defendingTerritory'), defendingTerritory);
  setElementInnerText(document.getElementById('attackerMilitary'), attackerMilitary);
  setElementInnerText(document.getElementById('defenderMilitary'), defendingMilitary);
}

const displayBattleDetails = function (battleDetails) {
  hideAttackAgainButton(battleDetails.attackerMilitary, battleDetails.defendingMilitary);
  displayContender(battleDetails);
  updateDiceImages(getAttackerDiceValue(), 'attacker-dice');
  updateDiceImages(getDefenderDiceValue(), 'defender-dice');
};

const getAttackerLostUnits = function (diceCount) {
  let attackerLostUnits = 0;
  const attackerDiceDetail = getAttackerDiceValue();
  const defenderDiceDetail = getDefenderDiceValue();
  for (let count = 0; count < diceCount; count++) {
    if (defenderDiceDetail[count] >= attackerDiceDetail[count]) {
      attackerLostUnits++;
    }
  }
  return attackerLostUnits;
}

const getBattleResult = function (diceCount) {
  const attackerLostUnits = getAttackerLostUnits(diceCount);
  const defenderLostUnits = diceCount - attackerLostUnits;
  return { attackerLostUnits, defenderLostUnits };
};

const sendBattleResult = function (battleDetails) {
  const diceCount = getDiceCountForBattle(battleDetails);
  const { attackerLostUnits, defenderLostUnits } = getBattleResult(diceCount);
  fetch('/updateCount', sendPostRequest({ attackerLostUnits, defenderLostUnits }))
    .then(res => res.json())
    .then(battleDetails => setTimeout(() => displayBattleDetails(battleDetails), 2000));
};

const startBattle = function (battleDetails) {
  if (battleDetails.startBattle) {
    setElementDisplay(document.getElementById('popupBox'), 'flex');
    setElementDisplay(document.getElementById('btnAttackAgain'), 'flex');
    displayBattleDetails(battleDetails);
    sendBattleResult(battleDetails);
  }
};

const startAttack = function (event) {
  const selectedTerritory = event.target;
  const territoryName = selectedTerritory.parentElement.id;
  fetch('/attack', sendPostRequest({ territoryName }))
    .then(res => res.json())
    .then(battleDetails => startBattle(battleDetails));
};

const attackAgain = function () {
  fetch('/attackAgain')
    .then(res => res.json())
    .then(battleDetails => startBattle(battleDetails));
};

const updateTerritoryRuler = function (battleResult) {
  const { color, attackerMilitary, attackingTerritory, defendingTerritory } = battleResult;
  document.getElementById(defendingTerritory).childNodes[1].style.fill = color;
  document.getElementById(defendingTerritory).childNodes[3].textContent = '1';
  document.getElementById(attackingTerritory).childNodes[3].textContent = attackerMilitary;
  setElementDisplay(document.getElementById('selectMilitaryUnit'), DISPLAY_BLOCK);
  setElementInnerText(document.getElementById('number'), attackerMilitary - 1);
  document.getElementById('hdnNumber').value = attackerMilitary - 1;
}

const battleComplete = function () {
  fetch('/battleComplete')
    .then(res => res.json())
    .then(battleResult => {
      if (battleResult.won) {
        updateTerritoryRuler(battleResult);
      }
    });
  setElementDisplay(document.getElementById('btnAttackAgain'), DISPLAY_BLOCK);
  hideElement(document.getElementById('popupBox'));
};
