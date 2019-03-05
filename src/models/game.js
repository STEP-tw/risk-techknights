class Games {
  constructor() {
    this.games = {};
  }

  addGame(game) {
    if (game.id) {
      this.games[game.id] = game;
    }
  }

  getGame(id) {
    return this.games[id];
  }

  removeGame(id) {
    delete this.games[id];
  }

  isRunning(id) {
    return Object.keys(this.games).includes(id);
  }
}

class Game {
  constructor(id, territories, totalPlayerCount) {
    this.id = id;
    this.players = [];
    this.order = [];
    this.originalOrder = [];
    this.colors = [
      '#ecec6c',
      '#de9e30',
      '#b0de92',
      '#bdd3e6',
      '#dc7272',
      '#b7a7e0'
    ];
    this.phase = 1;
    this.attack;
    this.reinforcement;
    this.fortify;
    this.territories = territories;
    this.totalPlayerCount = totalPlayerCount;
    this.horsePosition = [
      4,
      6,
      8,
      10,
      15,
      20,
      25,
      30,
      35,
      40,
      45,
      50,
      55,
      60,
      65
    ];
    this.currentHorseIndex = 0;
    this.continents;
    this.activityLog;
  }

  addPlayer(player) {
    player.setColor(this.colors.shift());
    this.players.push(player);
    this.order.push(player.id);
  }

  getPlayers() {
    return this.players;
  }

  decideOrder(random) {
    let randomOrder = [];
    while (this.order.length != 0) {
      let index = Math.floor(random() * this.order.length);
      randomOrder.push(this.order[index]);
      this.order.splice(index, 1);
    }
    this.order = randomOrder;
    this.originalOrder = this.order.slice(0);
  }

  changeTurn() {
    this.order.push(this.order.shift());
    this.activityLog.changeTurn(this.getCurrentPlayer());
  }

  changePlayerPhase() {
    this.getCurrentPlayer().phase = this.getCurrentPlayer().phase + 1;
    if (this.getCurrentPlayer().phase > 5) {
      this.getCurrentPlayer().phase = 3;
      this.changeTurn();
    }
  }

  getCurrentPlayer() {
    const currentPlayerID = this.order[0];
    const isCurrentPayer = player => player.id == currentPlayerID;
    return this.players.find(isCurrentPayer);
  }

  getNextPlayer() {
    const nextPlayerID = this.order[1];
    const isNextPayer = player => player.id == nextPlayerID;
    return this.players.find(isNextPayer);
  }

  getTotalPlayerCount() {
    return this.totalPlayerCount;
  }

  changePhase() {
    this.players.forEach(player => {
      player.phase = player.phase + 1;
    });
  }

  isAllTerritoriesOccupied() {
    return (
      Object.keys(this.territories).filter(
        territory => this.territories[territory].ruler
      ).length == 42
    );
  }

  getPlayerDetailsById(id) {
    const isCurrentPayer = player => player.id == id;
    return this.players.find(isCurrentPayer);
  }
  getInitialMilitaryCount() {
    const initialMilitaryCounts = { 2: 30, 3: 35, 4: 30, 5: 25, 6: 20 };
    return initialMilitaryCounts[this.totalPlayerCount];
  }

  decidePlayersColor(random) {
    let randomColor = [];
    while (this.colors.length != 0) {
      let index = Math.floor(random() * this.colors.length);
      randomColor.push(this.colors[index]);
      this.colors.splice(index, 1);
    }
    this.colors = randomColor;
  }

  updateHorsePosition() {
    this.currentHorseIndex = this.currentHorseIndex + 1;
  }

  tradeCards() {
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.receivedCards.canTrade()) {
      currentPlayer.addMilitaryUnits(
        this.horsePosition[this.currentHorseIndex]
      );
      this.updateHorsePosition();
    }
  }
  calculateTotalConinentBonus(playerId) {
    const continents = Object.keys(this.continents);
    const continentsBonus = continents.map(continent =>
      this.continents[continent].getContinentBonus(playerId)
    );
    return continentsBonus.reduce((a, b) => a + b);
  }
  calculateTotalTerritoryBonus(playerId) {
    const conqueredTerritories = Object.keys(this.territories).filter(
      territory => this.territories[territory].ruler.id == playerId
    );
    return Math.max(Math.floor(conqueredTerritories.length / 3), 3);
  }

  calculateBonusMilitaryUnits(playerId) {
    const militaryBonus =
      this.calculateTotalConinentBonus(playerId) +
      this.calculateTotalTerritoryBonus(playerId);
    this.activityLog.receiveArmy(
      this.getPlayerDetailsById(playerId),
      militaryBonus
    );
    return militaryBonus;
  }

  getHorsePosition() {
    if (this.currentHorseIndex >= this.horsePosition.length) {
      return 65;
    }
    return this.horsePosition[this.currentHorseIndex];
  }

  removeEliminatedPlayerTurn(player) {
    const playerTurn = this.order.indexOf(player.id);
    if (playerTurn != -1) {
      this.order.splice(playerTurn, 1);
      this.activityLog.eliminate(player);
    }
  }
}

module.exports = { Game, Games };
