const ENCODING = 'utf-8';
const TERRITORY_FILE_PATH = './src/data/territory.json'

const INSTRUCTIONS = {
  waitingMsg: 'Wait for your turn',
  1: { defaultMsg: 'Click on a territory to claim it' },
  2: { defaultMsg: 'Place remaining Military Units to move to reinforcement phase' },
  3: { defaultMsg: 'Select a territory to place the new military units' },
  4: { defaultMsg: 'Select attacking and defending territory to battle' },
  5: { defaultMsg: 'Select one of your territory to fortify' }
}

module.exports = {
  ENCODING,
  TERRITORY_FILE_PATH,
  INSTRUCTIONS
}