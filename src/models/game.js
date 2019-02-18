class Game {
  constructor(player, id) {
    this.players = {};
    this.players[id] = player;
    this.order = [id];
    this.phase;
    this.attack;
    this.reinforcement;
    this.fortify;
  }
  addPlayer(player, id) {
    this.players[id] = player;
    this.order.push(id);
  }
  removePlayer(id) {}
  decideOrder() {}
  changeTurn() {}
  getTurn() {}
  changePhase() {}
  initialiseReinforcement() {}
  initialiseAttack() {}
  initialiseFortify() {}
}

module.exports = Game;
