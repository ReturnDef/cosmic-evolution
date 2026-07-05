export class Life {
  population: number;
  developmentLevel: number = 0;
  evolutionSpeed: number;

  constructor(population: number = 100) {
    this.population = population;
    this.evolutionSpeed = 0.1 + Math.random() * 0.2;
  }

  evolve() {
    this.developmentLevel += this.evolutionSpeed;
    this.population += this.population * 0.01 * (1 + this.developmentLevel / 100);
    this.population = Math.floor(this.population);
  }

  getStage(): string {
    if (this.population < 10) return '💀 Extinct';
    if (this.developmentLevel < 10) return '🦠 Microorganisms';
    if (this.developmentLevel < 25) return '🌱 Plants';
    if (this.developmentLevel < 40) return '🐟 Animals';
    if (this.developmentLevel < 55) return '🧠 Intelligent Species';
    if (this.developmentLevel < 70) return '🏛️ Civilization';
    if (this.developmentLevel < 85) return '🚀 Space Civilization';
    return '🌌 Interstellar Civilization';
  }
}