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
}

class Game {
  constructor(id, territories) {
    this.id = id;
    this.players = [];
    this.order = [];
    this.colors = ["aqua", "#98fb98", "#d9ff00", "#f08080"];
    this.phase =1;
    this.attack;
    this.reinforcement;
    this.fortify;
    this.territories = territories;
    this.totalPlayerCount ;
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
  }

  changeTurn() {
    this.order.push(this.order.shift());
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

  getTotalPlayerCount(){
    return this.totalPlayerCount;
  }

  getPhase() {
    return this.phase;
  }

  changePhase() {
    this.phase = this.phase +1;
  }

  isAllTerritoriesOccupied() {
    return (
      Object.keys(this.territories).filter(
        territory => this.territories[territory].ruler 
      ).length == 4
    );
  }

  getPlayerDetailsById(id) {
    const isCurrentPayer = player => player.id == id;
    return this.players.find(isCurrentPayer);
  }
}

module.exports = { Game, Games };
