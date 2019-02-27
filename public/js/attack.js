const ATTACKER_MAX_MILITARY = 3;
const DEFENDER_MAX_MILITARY = 2;
const DICE_MAX_VALUE = 6;

const DICE_IMAGE_PATHS = [
  './images/one.png',
  './images/two.png',
  './images/three.png',
  './images/four.png',
  './images/five.png',
  './images/six.png'
];

const updateInnerText = function (element, text) {
  setElementInnerText(document.getElementById(element), text);
};

const displayBattleDetails = function (battleDetails) {
  if (battleDetails.attackerMilitary < 2 || battleDetails.defendingMilitary < 1) {
    document.getElementById('btnAttackAgain').style.display = 'none';
  }
  updateInnerText('attackerName', battleDetails.attackerName.name);
  updateInnerText('defenderName', battleDetails.defenderName.name);
  updateInnerText('attackingTerritory', battleDetails.attackingTerritory);
  updateInnerText('defendingTerritory', battleDetails.defendingTerritory);
  updateInnerText('attackerMilitary', battleDetails.attackerMilitary);
  updateInnerText('defenderMilitary', battleDetails.defendingMilitary);

  const attackerDiceValues = getAttackerDiceValue();
  const defenderDiceValues = getDefenderDiceValue();
  updateAttackerDiceImages(attackerDiceValues, 'attacker-dice');
  updateAttackerDiceImages(defenderDiceValues, 'defender-dice');
};

const updateAttackerDiceImages = function (attackerDiceValues, playerType) {
  attackerDiceValues.forEach((value, index) => {
    let id = index + 1;
    let element = document.getElementById(playerType + id);

    if (value) {
      let image = element.getElementsByTagName('img')[0];
      image.src = DICE_IMAGE_PATHS[value - 1];
      image.className = 'updatedDice'
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
  const transform = ['scaleX(1) ', 'scaleX(-1) ', 'scaleY(-1) ']
  const diceImage = createDiceImage(document, transform)
  const diceElement = createDiceElement(document, diceID, dice);
  diceElement.appendChild(diceImage);
  setElementName(diceElement, Math.ceil(Math.random() * DICE_MAX_VALUE));
  setElementClass(diceElement, diceID);
  return diceElement;
}

const createDice = function (numberOfDice, diceID) {
  const diceContainer = createElement(document, 'div');
  for (let dice = 1; dice <= numberOfDice; dice++) {
    const diceElement = setDiceValue(document, diceID, dice);
    diceContainer.appendChild(diceElement);
  }
  return diceContainer.innerHTML;
};

const generateAttackerDice = function (militaryUnit) {
  let attackerDiceCount = militaryUnit - 1;
  if (+militaryUnit > ATTACKER_MAX_MILITARY) {
    attackerDiceCount = 3;
  }
  const attackerDice = createDice(attackerDiceCount, 'attacker-dice');
  document.getElementById('attackerDice').innerHTML = attackerDice;
  return attackerDiceCount;
};

const generateDefenderDice = function (militaryUnit) {
  let defenderDiceCount = militaryUnit;
  if (+militaryUnit >= DEFENDER_MAX_MILITARY) {
    defenderDiceCount = 2;
  }
  const defenderDice = createDice(defenderDiceCount, 'defender-dice');
  document.getElementById('defenderDice').innerHTML = defenderDice;
  return defenderDiceCount;
};

const getAttackerDiceValue = function () {
  return ['attacker-dice1', 'attacker-dice2', 'attacker-dice3']
    .map(dice => +getElementName(document, dice)).sort().reverse();
};

const getDefenderDiceValue = function () {
  return ['defender-dice1', 'defender-dice2']
    .map(dice => +getElementName(document, dice)).sort().reverse();
};

const getBattleResult = function (diceCount) {
  let attackerLostUnits = 0;
  const attackerDiceDetail = getAttackerDiceValue();
  const defenderDiceDetail = getDefenderDiceValue();
  for (let count = 0; count < diceCount; count++) {
    if (defenderDiceDetail[count] >= attackerDiceDetail[count]) {
      attackerLostUnits++;
    }
  }
  const defenderLostUnits = diceCount - attackerLostUnits;
  return { attackerLostUnits, defenderLostUnits };
};

const getDiceCountForBattle = function (battleDetails) {
  const diceCount = generateAttackerDice(battleDetails.attackerMilitary);
  const defenderDiceCount = generateDefenderDice(
    battleDetails.defendingMilitary
  );
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
    .then(battleDetails => {
      document.getElementById('loadingMsg').innerText = 'loading...';
      setTimeout(() => {
        document.getElementById('loadingMsg').innerText = '';
        displayBattleDetails(battleDetails);
      }, 2000);
    });
};

const startBattle = function (battleDetails) {
  // if (battleDetails.previousTerritory) {
  //   document.getElementById(battleDetails.previousTerritory.name).childNodes[1].style.fill = '#f2f2f2';
  // }
  if (battleDetails.startBattle) {
    document.getElementById('popupBox').style.display = 'flex';
    document.getElementById('btnAttackAgain').style.display = 'flex';
    displayBattleDetails(battleDetails);
    sendBattleResult(battleDetails);
  }
};

const startAttack = function (event) {
  const selectedTerritory = event.target;
  const territoryName = selectedTerritory.parentElement.id;
  fetch('/attack', sendPostRequest({ territoryName }))
    .then(res => res.json())
    .then(battleDetails => {
      selectedTerritory.style.opacity = '1.5'
      startBattle(battleDetails);
    });
};

const attackAgain = function () {
  fetch('/attackAgain', sendPostRequest({}))
    .then(res => res.json())
    .then(battleDetails => {
      startBattle(battleDetails);
    });
};

const battleComplete = function () {
  fetch('/battleComplete', sendPostRequest({}))
    .then(res => res.json())
    .then(battleResult => {
      const { color, attack } = battleResult;
      if (attack.won) {
        const defendingTerritory = attack.defendingTerritory.name;
        const attackingTerritory = attack.attackingTerritory.name;
        const attackerMilitary = attack.attackingTerritory.militaryUnits;
        document.getElementById(defendingTerritory).childNodes[1].style.fill = color;
        document.getElementById(defendingTerritory).childNodes[3].textContent = '1';
        document.getElementById(attackingTerritory).childNodes[3].textContent = attackerMilitary;
        document.getElementById('selectMilitaryUnit').style.display = 'block';
        document.getElementById('number').innerText = attackerMilitary - 1;
        document.getElementById('hdnNumber').value = attackerMilitary - 1;
      }
    });
  document.getElementById('btnAttackAgain').style.display = 'block';
  document.getElementById('popupBox').style.display = 'none';
};
