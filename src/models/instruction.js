class Instructions {
  constructor() {
    this.instructions = {};
  }
  addInstruction(phase, instruction) {
    this.instructions[phase] = instruction;
  }
  getInstruction(phase) {
    return this.instructions[phase];
  }
}

module.exports = Instructions;
