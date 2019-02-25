class Player {
  constructor(id, name, militaryUnits) {
    this.id = id;
    this.name = name;
    this.color;
    this.militaryUnits = militaryUnits;
    this.phase = 1;
    this.instruction ='Please wait for your turn';
    this.isActive = false;
  }

  getId() {
    return this.id;
  }


  setColor(color) {
    this.color = color;
  }

  removeMilitaryUnits(numberOfUnits) {
    this.militaryUnits -= numberOfUnits;
  }


  setInstruction(instruction) {
    this.instruction = instruction;
  }
}

module.exports = Player;
