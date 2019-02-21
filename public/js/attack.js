const ATTACKER_MAX_MILITARY = 3;
const DEFENDER_MAX_MILITARY = 2;
const DICE_MAX_VALUE = 6;

const updateInnerText = function(element, text) {
  setElementInnerText(document.getElementById(element), text);
};

displayBattleDetails = function(battleDetails) {
  if (battleDetails.attackerMilitary < 2 || battleDetails.defendingMilitary < 1) {
    document.getElementById("btnAttackAgain").style.display = "none";
  }
  updateInnerText("attackerName", battleDetails.attackerName.name);
  updateInnerText("defenderName", battleDetails.defenderName.name);
  updateInnerText("attackingTerritory", battleDetails.attackingTerritory);
  updateInnerText("defendingTerritory", battleDetails.defendingTerritory);
  updateInnerText("attackerMilitary", battleDetails.attackerMilitary);
  updateInnerText("defenderMilitary", battleDetails.defendingMilitary);
};

const createDice = function(numberOfDice, diceID) {
  const diceContainer = createView(document);
  for (let dice = 1; dice <= numberOfDice; dice++) {
    const diceElement = createView(document);
    diceElement.id = diceID + dice;
    setElementInnerText(diceElement, Math.ceil(Math.random() * DICE_MAX_VALUE));
    setElementCssClass(diceElement, diceID);
    diceContainer.appendChild(diceElement);
  }
  return diceContainer.innerHTML;
};

const generateAttackerDice = function(militaryUnit) {
  let attackerDiceCount = militaryUnit - 1;
  if (+militaryUnit >= ATTACKER_MAX_MILITARY) {
    attackerDiceCount = 3;
  }
  const attackerDice = createDice(attackerDiceCount, "attacker-dice");
  document.getElementById("attackerDice").innerHTML = attackerDice;
  return attackerDiceCount;
};

const generateDefenderDice = function(militaryUnit) {
  let defenderDiceCount = militaryUnit;
  if (+militaryUnit >= DEFENDER_MAX_MILITARY) {
    defenderDiceCount = 2;
  }
  const defenderDice = createDice(defenderDiceCount, "defender-dice");
  document.getElementById("defenderDice").innerHTML = defenderDice;
  return defenderDiceCount;
};

const getAttackerDiceValue = function() {
  return ["attacker-dice1", "attacker-dice2", "attacker-dice3"]
    .map(dice => +getElementInnerText(document, dice)).sort().reverse();
};

const getDefenderDiceValue = function() {
  return ["defender-dice1", "defender-dice2"]
    .map(dice => +getElementInnerText(document, dice)).sort().reverse();
};

const getBattleResult = function(diceCount) {
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

const getDiceCountForBattle = function(battleDetails) {
  const diceCount = generateAttackerDice(battleDetails.attackerMilitary);
  const defenderDiceCount = generateDefenderDice(
    battleDetails.defendingMilitary
  );
  if (diceCount > defenderDiceCount) {
    return defenderDiceCount;
  }
  return diceCount;
};

const sendBattleResult = function(battleDetails) {
  const diceCount = getDiceCountForBattle(battleDetails);
  const { attackerLostUnits, defenderLostUnits } = getBattleResult(diceCount);

  fetch("/updateCount",sendPostRequest({ attackerLostUnits, defenderLostUnits }))
    .then(res => res.json())
    .then(battleDetails => {
      document.getElementById("loadingMsg").innerText = "loading...";
      setTimeout(() => {
        document.getElementById("loadingMsg").innerText = "";
        displayBattleDetails(battleDetails);
      }, 2000);
    });
};

const startBattle = function(battleDetails) {
  if (battleDetails.previousTerritory) {
    document.getElementById(battleDetails.previousTerritory.name).childNodes[1].style.fill = "#f2f2f2";
  }
  if (battleDetails.startBattle) {
    document.getElementById("popupBox").style.display = "block";
    displayBattleDetails(battleDetails);
    sendBattleResult(battleDetails);
  }
};

const startAttack = function(event) {
  const selectedTerritory = event.target;
  const territoryName = selectedTerritory.parentElement.id;
  fetch("/attack", sendPostRequest({ territoryName }))
    .then(res => res.json())
    .then(battleDetails => {
      selectedTerritory.style.fill = "#98FB98";
      startBattle(battleDetails);
    });
};

const attackAgain = function() {
  fetch("/attackAgain", sendPostRequest({}))
    .then(res => res.json())
    .then(battleDetails => {
      startBattle(battleDetails);
    });
};

const battleComplete = function() {
  fetch("/battleComplete", sendPostRequest({}))
    .then(res => res.json())
    .then(territory => {
      document.getElementById(territory.attackingTerritory.name).childNodes[1].style.fill = "#f2f2f2";
      document.getElementById(territory.defendingTerritory.name).childNodes[1].style.fill = "#f2f2f2";
    });
  document.getElementById("popupBox").style.display = "none";
};
