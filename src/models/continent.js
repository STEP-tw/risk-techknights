class Continent {
  constructor(name, territories, numberOfMilitaryUnits) {
    this.name = name
    this.territories = territories
    this.numberOfMilitaryUnits = numberOfMilitaryUnits;

  }

  isOccupied(playerID) {
    const isPlayerRuler = this.territories.every(territory => territory.ruler.id == playerID)
    return isPlayerRuler;
  }
  
  getContinentBonus(playerID) {
    if (this.isOccupied(playerID)) return this.numberOfMilitaryUnits
    return 0
  }
}
module.exports = { Continent }