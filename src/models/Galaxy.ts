import { Star } from './Star';
import type { Position, Velocity } from '../types/index';

export class Galaxy {
  name: string;
  position: Position;
  velocity: Velocity;
  stars: Star[] = [];
  age: number = 0;
  size: number;
  color: { r: number; g: number; b: number };
  rotationAngle: number = 0;
  rotationSpeed: number;
  
  // Границы для звезд внутри галактики
  private starBoundaryPadding: number = 20;

  constructor(name: string, position: Position, velocity: Velocity) {
    this.name = name;
    this.position = position;
    this.velocity = velocity;
    this.size = 40 + Math.random() * 60;
    this.color = {
      r: 100 + Math.floor(Math.random() * 155),
      g: 100 + Math.floor(Math.random() * 155),
      b: 150 + Math.floor(Math.random() * 105)
    };
    this.rotationSpeed = 0.001 + Math.random() * 0.003;
  }

  createStar(): Star {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * this.size * 0.7; // Уменьшил максимальное расстояние
    const star = new Star(
      `Star-${Date.now()}-${this.stars.length}`,
      {
        x: this.position.x + Math.cos(angle) * dist,
        y: this.position.y + Math.sin(angle) * dist
      },
      3000 + Math.random() * 12000
    );
    this.stars.push(star);
    return star;
  }

  getPlanetCount(): number {
    return this.stars.reduce((sum, s) => sum + s.planets.length, 0);
  }

  getLifeWorldsCount(): number {
    return this.stars.reduce((sum, s) => 
      sum + s.planets.filter(p => p.hasLife).length, 0
    );
  }

  getCivilizationCount(): number {
    return this.stars.reduce((sum, s) => 
      sum + s.planets.filter(p => p.civilization !== null).length, 0
    );
  }

  update(width: number, height: number, padding: number = 40) {
    this.age++;
    this.rotationAngle += this.rotationSpeed;
    
    // Движение галактики
    this.position.x += this.velocity.vx;
    this.position.y += this.velocity.vy;
    
    // Отражение галактики от границ
    if (this.position.x < padding) {
      this.position.x = padding;
      this.velocity.vx *= -0.9;
    }
    if (this.position.x > width - padding) {
      this.position.x = width - padding;
      this.velocity.vx *= -0.9;
    }
    if (this.position.y < padding) {
      this.position.y = padding;
      this.velocity.vy *= -0.9;
    }
    if (this.position.y > height - padding) {
      this.position.y = height - padding;
      this.velocity.vy *= -0.9;
    }
    
    // Обновление звезд с ограничением вращения
    for (const star of this.stars) {
      star.update();
      
      // Вращение звезды вокруг центра галактики, но с ограничением
      const dx = star.position.x - this.position.x;
      const dy = star.position.y - this.position.y;
      const dist = Math.hypot(dx, dy);
      
      // Если звезда слишком далеко от центра - притягиваем обратно
      if (dist > this.size * 0.9) {
        const pull = 0.98;
        star.position.x = this.position.x + dx * pull;
        star.position.y = this.position.y + dy * pull;
      }
      
      // Вращение (только если звезда не слишком далеко)
      if (dist > 0 && dist < this.size * 0.9) {
        const rot = 0.002;
        const newX = this.position.x + dx * Math.cos(rot) - dy * Math.sin(rot);
        const newY = this.position.y + dx * Math.sin(rot) + dy * Math.cos(rot);
        
        // Проверяем, что после вращения звезда не выходит за границы
        if (newX > 10 && newX < width - 10 && newY > 10 && newY < height - 10) {
          star.position.x = newX;
          star.position.y = newY;
        }
      }
    }
  }
}