export class Civilization {
  population: number;
  stage: string = 'Primitive';
  technology: number = 1;
  progress: number = 0;
  name: string;

  constructor(population: number) {
    this.population = population;
    this.name = `Civilization-${Date.now()}`;
  }

  advance() {
    this.population += this.population * 0.005;
    this.progress += 0.5 + this.technology * 0.1;
    
    const stages = ['Primitive', 'Ancient', 'Medieval', 'Industrial', 'Digital', 'Space Age', 'Interstellar'];
    const currentIndex = stages.indexOf(this.stage);
    
    if (this.progress > 100 && currentIndex < stages.length - 1) {
      this.progress = 0;
      this.stage = stages[currentIndex + 1];
      this.technology += 1;
    }
  }
}