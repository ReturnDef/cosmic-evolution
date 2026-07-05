import type { Position } from '../types/index';

export class Catastrophe {
  type: 'asteroid' | 'supernova' | 'gamma' | 'blackhole';
  position: Position;
  intensity: number;
  active: boolean = true;
  duration: number = 0;
  maxDuration: number = 100;

  constructor(type: 'asteroid' | 'supernova' | 'gamma' | 'blackhole', position: Position, intensity: number) {
    this.type = type;
    this.position = position;
    this.intensity = intensity;
  }

  update() {
    this.duration++;
    if (this.duration > this.maxDuration) {
      this.active = false;
    }
  }

  getColor(): string {
    switch (this.type) {
      case 'asteroid': return 'rgba(255, 200, 50, 0.6)';
      case 'supernova': return 'rgba(255, 255, 255, 0.8)';
      case 'gamma': return 'rgba(100, 50, 255, 0.6)';
      case 'blackhole': return 'rgba(0, 0, 0, 0.8)';
    }
  }
}