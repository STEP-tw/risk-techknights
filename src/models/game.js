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
    this.colors = ["red", "green", "blue", "yellow"];
    this.phase;
    this.attack;
    this.reinforcement;
    this.fortify;
  }

  addPlayer(player) {
    player.setColor(this.colors.shift());
    this.players.push(player);
    this.order.push(player.id);
  }

  getPlayers() {
    return this.players;
  }

  decideOrder() {
    let randomOrder = [];
    while (this.order.length != 0) {
      let index = Math.floor(Math.random() * this.order.length);
      randomOrder.push(this.order[index]);
      this.order.splice(index, 1);
    }
    this.order = randomOrder;
  }

  // changePhase() {}
  // removePlayer(id) {}
  // changeTurn() {}
  // getTurn() {}
  //changePhase() {}
  // initialiseReinforcement() {}
  // initialiseAttack() {}
  // initialiseFortify() {}
}

module.exports = { Game, Games };
