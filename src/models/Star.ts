import { Planet } from './Planet';
import type { Position } from '../types/index';

export class Star {
  name: string;
  position: Position;
  temperature: number;
  age: number = 0;
  size: number;
  planets: Planet[] = [];
  isSupernova: boolean = false;
  supernovaTimer: number = 0;
  color: { r: number; g: number; b: number };
  maxAge: number;
  
  // Добавляем границы
  private minX: number = 30;
  private maxX: number = 870;
  private minY: number = 30;
  private maxY: number = 620;

  constructor(name: string, position: Position, temperature: number = 5000) {
    this.name = name;
    this.position = position;
    this.temperature = temperature;
    this.size = 2 + Math.random() * 5;
    this.color = this.calculateColor();
    this.maxAge = 1000 + Math.random() * 2000;
  }

  private calculateColor() {
    if (this.temperature < 3000) return { r: 255, g: 100, b: 50 };
    if (this.temperature < 5000) return { r: 255, g: 200, b: 100 };
    if (this.temperature < 7000) return { r: 255, g: 255, b: 200 };
    if (this.temperature < 10000) return { r: 200, g: 220, b: 255 };
    return { r: 150, g: 180, b: 255 };
  }

  getGlowRadius(): number {
    if (this.isSupernova) {
      return this.size * 3 * (1 + (50 - this.supernovaTimer) / 50);
    }
    return this.size * 4;
  }

  // Ограничение позиции
  private clampPosition() {
    this.position.x = Math.max(this.minX, Math.min(this.maxX, this.position.x));
    this.position.y = Math.max(this.minY, Math.min(this.maxY, this.position.y));
  }

  update() {
    this.age++;
    
    if (this.isSupernova) {
      this.supernovaTimer--;
      if (this.supernovaTimer <= 0) {
        this.isSupernova = false;
        this.size = 1 + Math.random() * 2;
        this.temperature = 2000 + Math.random() * 4000;
        this.color = this.calculateColor();
      }
      return;
    }
    
    if (this.age > this.maxAge && Math.random() < 0.0005) {
      this.isSupernova = true;
      this.supernovaTimer = 50;
      this.size = this.size * 2;
    }
    
    // Ограничиваем позицию звезды
    this.clampPosition();
    
    for (const planet of this.planets) {
      planet.update();
    }
  }
}