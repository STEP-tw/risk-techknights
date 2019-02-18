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
  constructor(id) {
    this.id = id;
    this.players = [];
    this.order = [];
    this.phase;
    this.attack;
    this.reinforcement;
    this.fortify;
  }
  addPlayer(player) {
    this.players.push(player);
    this.order.push(player.id);
  }
  // removePlayer(id) {}
  // decideOrder() {}
  // changeTurn() {}
  // getTurn() {}
  // changePhase() {}
  // initialiseReinforcement() {}
  // initialiseAttack() {}
  // initialiseFortify() {}
}

module.exports = { Game, Games };
