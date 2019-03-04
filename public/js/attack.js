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
  updateAttackerDiceImages(getAttackerDiceValue(), 'attacker-dice');
  updateAttackerDiceImages(getDefenderDiceValue(), 'defender-dice');
};

const updateAttackerDiceImages = function (attackerDiceValues, playerType) {
  let dicePosition = 1;
  attackerDiceValues.forEach(value => {
    const element = document.getElementById(playerType + dicePosition++);
    if (value) {
      const image = element.getElementsByTagName('img')[0];
      image.src = DICE_IMAGE_PATHS[value - 1];
      image.className = 'updatedDice';
    }
  });
}

const createDiceImage = function (document, transform) {
  const diceImage = createElement(document, 'img');
  diceImage.src = './images/dice.gif';
  diceImage.style.transform = transform[Math.floor(Math.random() * 3)]
  diceImage.className = 'diceImageGif';
  return diceImage;
}

const createDiceElement = function (document, diceID, dice) {
  const diceElement = createElement(document, 'div');
  diceElement.id = diceID + dice;
  return diceElement;
}

const setDiceValue = function (document, diceID, dice) {
  const transform = ['scaleX(1) ', 'scaleX(-1) ', 'scaleY(-1) '];
  const diceImage = createDiceImage(document, transform);
  const diceElement = createDiceElement(document, diceID, dice);
  diceElement.appendChild(diceImage);
  setElementName(diceElement, Math.ceil(Math.random() * DICE_MAX_VALUE));
  setElementClass(diceElement, diceID);
  return diceElement;
}

const createDice = function (numberOfDices, diceID) {
  const diceContainer = createElement(document, 'div');
  for (let dice = 1; dice <= numberOfDices; dice++) {
    const diceElement = setDiceValue(document, diceID, dice);
    diceContainer.appendChild(diceElement);
  }
  return diceContainer.innerHTML;
};

const generateAttackerDice = function (militaryUnit) {
  let attackerDiceCount = +militaryUnit - 1;
  if (+militaryUnit > ATTACKER_MAX_MILITARY) {
    attackerDiceCount = 3;
  }
  const attackerDice = createDice(attackerDiceCount, 'attacker-dice');
  document.getElementById('attackerDice').innerHTML = attackerDice;
  return attackerDiceCount;
};

const generateDefenderDice = function (militaryUnit) {
  let defenderDiceCount = +militaryUnit;
  if (+militaryUnit >= DEFENDER_MAX_MILITARY) {
    defenderDiceCount = 2;
  }
  const defenderDice = createDice(defenderDiceCount, 'defender-dice');
  document.getElementById('defenderDice').innerHTML = defenderDice;
  return defenderDiceCount;
};

const getAttackerDiceValue = function () {
  const values = ['attacker-dice1', 'attacker-dice2', 'attacker-dice3'].
    map(dice => +getElementName(document, dice));
  return reverseSort(values);
};

const getDefenderDiceValue = function () {
  const values = ['defender-dice1', 'defender-dice2'].map(dice => +getElementName(document, dice));
  return reverseSort(values);
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
  let attackerLostUnits = getAttackerLostUnits(diceCount);
  const defenderLostUnits = diceCount - attackerLostUnits;
  return { attackerLostUnits, defenderLostUnits };
};

const getDiceCountForBattle = function (battleDetails) {
  const diceCount = generateAttackerDice(battleDetails.attackerMilitary);
  const defenderDiceCount = generateDefenderDice(battleDetails.defendingMilitary);
  if (diceCount > defenderDiceCount) {
    return defenderDiceCount;
  }
  return diceCount;
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
  setElementDisplay(document.getElementById('selectMilitaryUnit'), 'block');
  document.getElementById('number').innerText = attackerMilitary - 1;
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
  setElementDisplay(document.getElementById('btnAttackAgain'), 'block');
  hideElement(document.getElementById('popupBox'));
};
