import { Life } from './Life';
import { Civilization } from './Civilization';
import { Catastrophe } from './Catastrophe';
import type { Position } from '../types/index';

export class Planet {
  name: string;
  position: Position;
  size: number;
  temperature: number;
  age: number = 0;
  hasLife: boolean = false;
  life: Life | null = null;
  civilization: Civilization | null = null;
  orbitRadius: number = 20;
  orbitAngle: number = Math.random() * Math.PI * 2;
  orbitSpeed: number = 0.01 + Math.random() * 0.02;
  state: string = 'Forming';
  
  // Максимальный радиус орбиты
  maxOrbitRadius: number = 60;

  constructor(name: string, position: Position, size: number = 3) {
    this.name = name;
    this.position = position;
    this.size = size;
    this.temperature = 20 + (Math.random() - 0.5) * 80;
    this.orbitRadius = 15 + Math.random() * 35; // Уменьшил максимальный радиус
  }

  getOrbitPosition(centerX: number, centerY: number): Position {
    // Ограничиваем орбиту
    const clampedRadius = Math.min(this.orbitRadius, this.maxOrbitRadius);
    return {
      x: centerX + Math.cos(this.orbitAngle) * clampedRadius,
      y: centerY + Math.sin(this.orbitAngle) * clampedRadius
    };
  }

  getColor(): string {
    if (this.hasLife && this.life) {
      const level = this.life.developmentLevel;
      if (level < 20) return '#4a7c4a';
      if (level < 40) return '#3a8c3a';
      if (level < 60) return '#2a9c2a';
      if (level < 80) return '#1aac4a';
      return '#0abc5a';
    }
    if (this.temperature < 0) return '#8aacda';
    if (this.temperature < 20) return '#6a8a9a';
    if (this.temperature < 50) return '#c8b060';
    return '#da6a3a';
  }

  update() {
    this.age++;
    this.orbitAngle += this.orbitSpeed;
  }

  applyCatastrophe(cat: Catastrophe) {
    if (cat.type === 'supernova' || cat.type === 'blackhole') {
      this.hasLife = false;
      this.life = null;
      this.civilization = null;
      this.state = 'Destroyed';
      return;
    }
    
    if (this.life) {
      this.life.population *= (0.5 + Math.random() * 0.3);
      if (this.life.population < 10) {
        this.hasLife = false;
        this.life = null;
        this.state = 'Extinct';
      }
    }
  }
}