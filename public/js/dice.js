const createDiceElement = function (document, diceID, dice) {
  const diceElement = createElement(document, 'div');
  diceElement.id = diceID + dice;
  return diceElement;
}

const createDiceImage = function (document, transform) {
  const diceImage = createElement(document, 'img');
  diceImage.src = './images/dice.gif';
  diceImage.style.transform = transform[Math.floor(Math.random() * 3)];
  setElementClass(diceImage, 'diceImageGif');
  return diceImage;
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
  setElementInnerHTML(document.getElementById('attackerDice'), attackerDice);
  return attackerDiceCount;
};

const generateDefenderDice = function (militaryUnit) {
  let defenderDiceCount = +militaryUnit;
  if (+militaryUnit >= DEFENDER_MAX_MILITARY) {
    defenderDiceCount = 2;
  }
  const defenderDice = createDice(defenderDiceCount, 'defender-dice');
  setElementInnerHTML(document.getElementById('defenderDice'), defenderDice);
  return defenderDiceCount;
};

const getDiceCountForBattle = function (battleDetails) {
  const diceCount = generateAttackerDice(battleDetails.attackerMilitary);
  const defenderDiceCount = generateDefenderDice(battleDetails.defendingMilitary);
  if (diceCount > defenderDiceCount) {
    return defenderDiceCount;
  }
  return diceCount;
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

const updateDiceImages = function (diceValues, playerType) {
  let dicePosition = 1;
  diceValues.forEach(value => {
    const element = document.getElementById(playerType + dicePosition++);
    if (value) {
      const image = element.getElementsByTagName('img')[0];
      image.src = DICE_IMAGE_PATHS[value - 1];
      setElementClass(image, 'updatedDice');
    }
  });
}