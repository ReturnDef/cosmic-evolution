import { Galaxy } from './Galaxy';
import { Planet } from './Planet';
import { Life } from './Life';
import { Civilization } from './Civilization';
import { Catastrophe } from './Catastrophe';
import { EventLog } from '../utils/EventLog';

export class Universe {
  galaxies: Galaxy[] = [];
  catastrophes: Catastrophe[] = [];
  time: number = 0;
  width: number;
  height: number;
  isPaused: boolean = false;
  isFinished: boolean = false;
  
  // Границы для галактик (с отступом)
  private boundaryPadding: number = 40;

  get galaxyCount() { return this.galaxies.length; }
  get starCount() { return this.galaxies.reduce((sum, g) => sum + g.stars.length, 0); }
  get planetCount() { return this.galaxies.reduce((sum, g) => sum + g.getPlanetCount(), 0); }
  get lifeWorldsCount() { return this.galaxies.reduce((sum, g) => sum + g.getLifeWorldsCount(), 0); }
  get civilizationCount() { return this.galaxies.reduce((sum, g) => sum + g.getCivilizationCount(), 0); }

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.initialize();
  }

  initialize() {
    this.galaxies = [];
    this.catastrophes = [];
    this.time = 0;
    this.isFinished = false;
    
    const log = EventLog.getInstance();
    log.addEvent('🌌 The Universe is born!', 'birth');

    const galaxyCount = 3 + Math.floor(Math.random() * 3);
    const names = ['Milky Way', 'Andromeda', 'Triangulum', 'Whirlpool', 'Sombrero', 'Pinwheel'];
    
    for (let i = 0; i < galaxyCount; i++) {
      const galaxy = new Galaxy(
        names[i % names.length] + (i >= names.length ? `-${i}` : ''),
        { 
          x: this.boundaryPadding + Math.random() * (this.width - this.boundaryPadding * 2), 
          y: this.boundaryPadding + Math.random() * (this.height - this.boundaryPadding * 2) 
        },
        { vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 }
      );
      this.galaxies.push(galaxy);
      
      for (let j = 0; j < 8 + Math.floor(Math.random() * 12); j++) {
        galaxy.createStar();
      }
      
      log.addEvent(`✨ Galaxy "${galaxy.name}" formed with ${galaxy.stars.length} stars`, 'birth');
    }
  }

  update() {
    if (this.isPaused || this.isFinished) return;
    
    this.time += 0.01;

    for (const galaxy of this.galaxies) {
      // Обновляем галактику с передачей границ
      galaxy.update(this.width, this.height, this.boundaryPadding);
      
      if (Math.random() < 0.001) {
        galaxy.createStar();
        EventLog.getInstance().addEvent(`⭐ New star born in ${galaxy.name}`, 'birth');
      }
      
      for (const star of galaxy.stars) {
        if (star.planets.length < 4 && Math.random() < 0.002) {
          const planet = new Planet(
            `Planet-${Date.now()}`,
            { x: star.position.x + (Math.random() - 0.5) * 20, 
              y: star.position.y + (Math.random() - 0.5) * 20 },
            2 + Math.random() * 4
          );
          planet.orbitRadius = 15 + Math.random() * 40;
          star.planets.push(planet);
          EventLog.getInstance().addEvent(`🪐 Planet formed around ${star.name}`, 'birth');
        }
        
        for (const planet of star.planets) {
          if (!planet.hasLife && Math.random() < 0.0005) {
            planet.life = new Life(100 + Math.random() * 900);
            planet.hasLife = true;
            EventLog.getInstance().addEvent(`🧬 Life emerged on ${planet.name}`, 'birth');
          }
          
          if (planet.hasLife && planet.life) {
            planet.life.evolve();
            
            if (planet.life.developmentLevel > 50 && !planet.civilization) {
              planet.civilization = new Civilization(planet.life.population);
              EventLog.getInstance().addEvent(`🏛️ Civilization born on ${planet.name}`, 'birth');
            }
            
            if (planet.civilization) {
              planet.civilization.advance();
              if (Math.random() < 0.001) {
                EventLog.getInstance().addEvent(
                  `📈 ${planet.civilization.stage} civilization on ${planet.name}`,
                  'info'
                );
              }
            }
          }
        }
      }
    }

    if (this.catastrophes.length < 5 && Math.random() < 0.001) {
      const types: ('asteroid' | 'supernova' | 'gamma' | 'blackhole')[] = 
        ['asteroid', 'supernova', 'gamma', 'blackhole'];
      const type = types[Math.floor(Math.random() * types.length)];
      const catastrophe = new Catastrophe(
        type,
        { 
          x: this.boundaryPadding + Math.random() * (this.width - this.boundaryPadding * 2), 
          y: this.boundaryPadding + Math.random() * (this.height - this.boundaryPadding * 2) 
        },
        0.3 + Math.random() * 0.7
      );
      this.catastrophes.push(catastrophe);
      
      const names = {
        asteroid: '☄️ Asteroid Impact',
        supernova: '💥 Supernova',
        gamma: '⚡ Gamma Burst',
        blackhole: '🕳️ Black Hole'
      };
      EventLog.getInstance().addEvent(`${names[type]} detected!`, 'death');
    }

    for (const cat of this.catastrophes) {
      cat.update();
      
      for (const galaxy of this.galaxies) {
        for (const star of galaxy.stars) {
          for (const planet of star.planets) {
            const dist = Math.hypot(
              planet.position.x - cat.position.x,
              planet.position.y - cat.position.y
            );
            if (dist < 80 * cat.intensity) {
              planet.applyCatastrophe(cat);
            }
          }
        }
      }
    }
    
    this.catastrophes = this.catastrophes.filter(c => c.active);
  }

  reset() {
    this.initialize();
    EventLog.getInstance().addEvent('🔄 Universe reset', 'info');
  }
}