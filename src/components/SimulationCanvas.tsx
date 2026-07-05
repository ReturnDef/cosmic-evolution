import { useEffect, useRef, useState } from 'react';
import { Universe } from '../models/Universe';
import ObjectInfo from './ObjectInfo';

type Props = {
  universe: Universe;
  onObjectClick?: (info: any) => void;
};

export default function SimulationCanvas({ universe, onObjectClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const animationRef = useRef<number>();

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Проверяем клик по планетам в первую очередь (самые мелкие объекты)
    for (const galaxy of universe.galaxies) {
      for (const star of galaxy.stars) {
        for (const planet of star.planets) {
          const pos = planet.getOrbitPosition(star.position.x, star.position.y);
          // Увеличиваем зону клика для планет с жизнью
          const clickRadius = planet.hasLife ? planet.size * 5 : planet.size * 3;
          const dist = Math.hypot(mouseX - pos.x, mouseY - pos.y);
          if (dist < clickRadius) {
            const info = {
              id: planet.name,
              type: planet.hasLife ? '🧬 Life Planet' : '🪐 Planet',
              data: {
                'Temperature': `${Math.floor(planet.temperature)}°C`,
                'Age': planet.age,
                'Life': planet.hasLife ? (planet.life?.getStage() || 'Yes') : '❌ No Life',
                'Population': planet.life?.population || 0,
                'Civilization': planet.civilization?.stage || 'None',
                'State': planet.state
              }
            };
            setSelectedObject(info);
            if (onObjectClick) onObjectClick(info);
            return;
          }
        }
      }
    }

    // Проверяем клик по звездам
    for (const galaxy of universe.galaxies) {
      for (const star of galaxy.stars) {
        const dist = Math.hypot(mouseX - star.position.x, mouseY - star.position.y);
        if (dist < star.size * 4) {
          const info = {
            id: star.name,
            type: '⭐ Star',
            data: {
              'Temperature': `${Math.floor(star.temperature)}K`,
              'Age': star.age,
              'Planets': star.planets.length,
              'Supernova': star.isSupernova ? '💥 Yes' : 'No'
            }
          };
          setSelectedObject(info);
          if (onObjectClick) onObjectClick(info);
          return;
        }
      }
    }

    // Проверяем клик по галактикам
    for (const galaxy of universe.galaxies) {
      const dist = Math.hypot(mouseX - galaxy.position.x, mouseY - galaxy.position.y);
      if (dist < galaxy.size) {
        const info = {
          id: galaxy.name,
          type: '🌌 Galaxy',
          data: {
            'Stars': galaxy.stars.length,
            'Age': galaxy.age,
            'Planets': galaxy.getPlanetCount(),
            'Life Worlds': galaxy.getLifeWorldsCount(),
            'Civilizations': galaxy.getCivilizationCount()
          }
        };
        setSelectedObject(info);
        if (onObjectClick) onObjectClick(info);
        return;
      }
    }
    
    setSelectedObject(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 900;
    canvas.height = 650;

    const BOUNDARY_PADDING = 30;

    const draw = () => {
      // Космический фон
      const bgGrad = ctx.createRadialGradient(450, 325, 50, 450, 325, 500);
      bgGrad.addColorStop(0, '#0d1b2a');
      bgGrad.addColorStop(0.4, '#080e1a');
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рамка границы
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 10]);
      ctx.strokeRect(BOUNDARY_PADDING, BOUNDARY_PADDING, 
        canvas.width - BOUNDARY_PADDING * 2, 
        canvas.height - BOUNDARY_PADDING * 2);
      ctx.setLineDash([]);

      // Фоновые звезды
      const time = Date.now() / 3000;
      for (let i = 0; i < 500; i++) {
        const x = (i * 137.508 + 50) % canvas.width;
        const y = (i * 241.397 + 30) % canvas.height;
        const size = 0.3 + Math.random() * 1.2;
        const twinkle = 0.3 + Math.sin(time + i) * 0.3;
        const opacity = 0.1 + twinkle * 0.5;
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Катастрофы
      for (const cat of universe.catastrophes) {
        const alpha = 1 - cat.duration / cat.maxDuration;
        const pulse = 1 + Math.sin(cat.duration * 0.2) * 0.15;
        ctx.fillStyle = cat.getColor();
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.arc(cat.position.x, cat.position.y, 25 * cat.intensity * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        const glow = ctx.createRadialGradient(
          cat.position.x, cat.position.y, 0,
          cat.position.x, cat.position.y, 45 * cat.intensity * pulse
        );
        glow.addColorStop(0, cat.getColor());
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.globalAlpha = alpha * 0.25;
        ctx.beginPath();
        ctx.arc(cat.position.x, cat.position.y, 45 * cat.intensity * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Галактики
      for (const galaxy of universe.galaxies) {
        const pos = galaxy.position;
        const color = galaxy.color;
        
        const isVisible = pos.x > BOUNDARY_PADDING && pos.x < canvas.width - BOUNDARY_PADDING &&
                         pos.y > BOUNDARY_PADDING && pos.y < canvas.height - BOUNDARY_PADDING;
        
        if (!isVisible) continue;
        
        // Свечение галактики
        const grad = ctx.createRadialGradient(
          pos.x, pos.y, 0, 
          pos.x, pos.y, galaxy.size * 2.5
        );
        grad.addColorStop(0, `rgba(${color.r},${color.g},${color.b},0.9)`);
        grad.addColorStop(0.3, `rgba(${color.r},${color.g},${color.b},0.5)`);
        grad.addColorStop(0.6, `rgba(${color.r},${color.g},${color.b},0.2)`);
        grad.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, galaxy.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Спиральные рукава
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.1)`;
        ctx.lineWidth = 1;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath();
          const startR = galaxy.size * 0.3;
          const endR = galaxy.size * 1.8;
          for (let r = startR; r < endR; r += 2) {
            const angle = a + r * 0.03;
            const x = pos.x + Math.cos(angle + galaxy.rotationAngle) * r;
            const y = pos.y + Math.sin(angle + galaxy.rotationAngle) * r;
            if (r === startR) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Название галактики
        ctx.shadowColor = `rgba(${color.r},${color.g},${color.b},0.3)`;
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(255,255,255,0.5)`;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(galaxy.name, pos.x, pos.y - galaxy.size - 15);
        ctx.shadowBlur = 0;

        // Звезды
        for (const star of galaxy.stars) {
          const sPos = star.position;
          
          if (sPos.x < 0 || sPos.x > canvas.width || sPos.y < 0 || sPos.y > canvas.height) continue;
          
          // Свечение звезды
          const glow = star.getGlowRadius();
          const sGrad = ctx.createRadialGradient(
            sPos.x, sPos.y, 0, 
            sPos.x, sPos.y, glow
          );
          if (star.isSupernova) {
            sGrad.addColorStop(0, 'rgba(255,255,255,1)');
            sGrad.addColorStop(0.2, 'rgba(255,255,200,0.9)');
            sGrad.addColorStop(0.5, 'rgba(255,200,100,0.6)');
            sGrad.addColorStop(1, 'rgba(255,100,50,0)');
          } else {
            const c = star.color;
            sGrad.addColorStop(0, 'rgba(255,255,255,1)');
            sGrad.addColorStop(0.3, `rgba(${c.r},${c.g},${c.b},0.8)`);
            sGrad.addColorStop(0.7, `rgba(${c.r},${c.g},${c.b},0.3)`);
            sGrad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
          }
          ctx.fillStyle = sGrad;
          ctx.beginPath();
          ctx.arc(sPos.x, sPos.y, glow, 0, Math.PI * 2);
          ctx.fill();

          // Ядро звезды
          const coreGrad = ctx.createRadialGradient(
            sPos.x, sPos.y, 0,
            sPos.x, sPos.y, Math.max(2, star.size * 0.5)
          );
          coreGrad.addColorStop(0, '#ffffff');
          coreGrad.addColorStop(0.5, `rgba(${star.color.r},${star.color.g},${star.color.b},0.9)`);
          coreGrad.addColorStop(1, `rgba(${star.color.r},${star.color.g},${star.color.b},0)`);
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(sPos.x, sPos.y, Math.max(2, star.size * 0.5), 0, Math.PI * 2);
          ctx.fill();

          // ПЛАНЕТЫ
          for (const planet of star.planets) {
            const pPos = planet.getOrbitPosition(sPos.x, sPos.y);
            
            if (pPos.x < 0 || pPos.x > canvas.width || pPos.y < 0 || pPos.y > canvas.height) continue;
            
            // Орбита
            ctx.shadowColor = 'rgba(0, 212, 255, 0.05)';
            ctx.shadowBlur = 3;
            
            // Орбита становится ярче, если на ней есть жизнь
            const orbitAlpha = planet.hasLife ? 0.2 : 0.08;
            ctx.strokeStyle = `rgba(0, 212, 255, ${orbitAlpha})`;
            ctx.lineWidth = planet.hasLife ? 1 : 0.5;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.arc(sPos.x, sPos.y, planet.orbitRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.shadowBlur = 0;

            // ---- ЕСЛИ НА ПЛАНЕТЕ ЕСТЬ ЖИЗНЬ ----
            if (planet.hasLife) {
              const lifePulse = 0.7 + Math.sin(time * 2 + planet.age * 0.5) * 0.3;
              
              // 1. ВНЕШНЕЕ СВЕЧЕНИЕ (атмосфера)
              const atmosGrad = ctx.createRadialGradient(
                pPos.x, pPos.y, planet.size * 0.5,
                pPos.x, pPos.y, planet.size * 4 * lifePulse
              );
              atmosGrad.addColorStop(0, `rgba(0, 255, 100, ${0.15 * lifePulse})`);
              atmosGrad.addColorStop(0.5, `rgba(0, 255, 100, ${0.08 * lifePulse})`);
              atmosGrad.addColorStop(1, 'rgba(0, 255, 100, 0)');
              ctx.fillStyle = atmosGrad;
              ctx.beginPath();
              ctx.arc(pPos.x, pPos.y, planet.size * 4 * lifePulse, 0, Math.PI * 2);
              ctx.fill();

              // 2. ПУЛЬСИРУЮЩЕЕ КОЛЬЦО
              ctx.strokeStyle = `rgba(0, 255, 100, ${0.2 * lifePulse})`;
              ctx.lineWidth = 2;
              ctx.setLineDash([3, 8]);
              ctx.beginPath();
              ctx.arc(pPos.x, pPos.y, planet.size * 2.5 * lifePulse, 0, Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([]);

              // 3. САМА ПЛАНЕТА (зеленоватая)
              const pGrad = ctx.createRadialGradient(
                pPos.x - planet.size * 0.3, pPos.y - planet.size * 0.3, 0,
                pPos.x, pPos.y, planet.size * 1.3
              );
              pGrad.addColorStop(0, '#a8f0c0');
              pGrad.addColorStop(0.3, '#4ade80');
              pGrad.addColorStop(0.7, '#22c55e');
              pGrad.addColorStop(1, '#166534');
              ctx.fillStyle = pGrad;
              ctx.beginPath();
              ctx.arc(pPos.x, pPos.y, planet.size * 1.3, 0, Math.PI * 2);
              ctx.fill();

              // 4. ИКОНКА ЖИЗНИ 🧬
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillStyle = 'rgba(255,255,255,0.9)';
              ctx.shadowColor = 'rgba(0, 255, 100, 0.5)';
              ctx.shadowBlur = 15;
              ctx.fillText('🧬', pPos.x, pPos.y - planet.size * 2.5 - 5);
              ctx.shadowBlur = 0;

              // 5. ЕСЛИ ЕСТЬ ЦИВИЛИЗАЦИЯ - ДОБАВЛЯЕМ ЗОЛОТОЕ СВЕЧЕНИЕ
              if (planet.civilization) {
                const civPulse = 0.7 + Math.sin(time * 1.5 + planet.age * 0.7) * 0.3;
                
                // Золотое свечение цивилизации
                const civGrad = ctx.createRadialGradient(
                  pPos.x, pPos.y, planet.size * 1.5,
                  pPos.x, pPos.y, planet.size * 5 * civPulse
                );
                civGrad.addColorStop(0, `rgba(255, 215, 0, ${0.12 * civPulse})`);
                civGrad.addColorStop(0.5, `rgba(255, 215, 0, ${0.06 * civPulse})`);
                civGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
                ctx.fillStyle = civGrad;
                ctx.beginPath();
                ctx.arc(pPos.x, pPos.y, planet.size * 5 * civPulse, 0, Math.PI * 2);
                ctx.fill();

                // Иконка цивилизации 🏛️
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
                ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
                ctx.shadowBlur = 15;
                ctx.fillText('🏛️', pPos.x, pPos.y + planet.size * 2.5 + 15);
                ctx.shadowBlur = 0;

                // Название стадии цивилизации под планетой
                ctx.font = '8px Arial';
                ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
                ctx.shadowBlur = 0;
                const stageShort = planet.civilization.stage.substring(0, 10);
                ctx.fillText(stageShort, pPos.x, pPos.y + planet.size * 3.5 + 10);
              }

              // 6. СТАДИЯ ЖИЗНИ над планетой
              if (planet.life) {
                ctx.font = '8px Arial';
                ctx.fillStyle = 'rgba(0, 255, 100, 0.4)';
                ctx.textAlign = 'center';
                ctx.shadowBlur = 0;
                const lifeStage = planet.life.getStage();
                const shortStage = lifeStage.length > 15 ? lifeStage.substring(0, 12) + '..' : lifeStage;
                ctx.fillText(shortStage, pPos.x, pPos.y - planet.size * 3.8 - 2);
              }

            // ---- ЕСЛИ НА ПЛАНЕТЕ НЕТ ЖИЗНИ ----
            } else {
              // Обычная безжизненная планета
              const pGrad = ctx.createRadialGradient(
                pPos.x - planet.size * 0.3, pPos.y - planet.size * 0.3, 0,
                pPos.x, pPos.y, planet.size
              );
              const baseColor = planet.getColor();
              pGrad.addColorStop(0, '#ffffff');
              pGrad.addColorStop(0.3, baseColor);
              pGrad.addColorStop(1, '#1a1a2e');
              ctx.fillStyle = pGrad;
              ctx.beginPath();
              ctx.arc(pPos.x, pPos.y, planet.size, 0, Math.PI * 2);
              ctx.fill();

              // Маленький крестик для обозначения "без жизни"
              ctx.strokeStyle = 'rgba(255, 100, 100, 0.15)';
              ctx.lineWidth = 1;
              const cs = planet.size * 0.7;
              ctx.beginPath();
              ctx.moveTo(pPos.x - cs, pPos.y - cs);
              ctx.lineTo(pPos.x + cs, pPos.y + cs);
              ctx.moveTo(pPos.x + cs, pPos.y - cs);
              ctx.lineTo(pPos.x - cs, pPos.y + cs);
              ctx.stroke();
            }
          }
        }
      }

      // Легенда в правом нижнем углу
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.roundRect(canvas.width - 180, canvas.height - 80, 170, 70, 8);
      ctx.fill();

      ctx.font = '9px Arial';
      ctx.textAlign = 'left';
      
      // Жизнь
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(canvas.width - 170, canvas.height - 62, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('🧬 Life', canvas.width - 160, canvas.height - 59);
      
      // Цивилизация
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(canvas.width - 170, canvas.height - 42, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('🏛️ Civilization', canvas.width - 160, canvas.height - 39);
      
      // Без жизни
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(canvas.width - 170, canvas.height - 22, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillText('No Life', canvas.width - 160, canvas.height - 19);

      // Время
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`⏱ ${universe.time.toFixed(1)}`, canvas.width - 20, canvas.height - 15);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [universe]);

  // Добавляем метод roundRect для Canvas
  useEffect(() => {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (r > w/2) r = w/2;
        if (r > h/2) r = h/2;
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        return this;
      };
    }
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={900}
        height={650}
        onClick={handleClick}
        style={{
          borderRadius: '16px',
          background: 'radial-gradient(ellipse at center, #0d1b2a, #000000)',
          border: '1px solid rgba(0, 200, 255, 0.08)',
          boxShadow: '0 0 60px rgba(0, 200, 255, 0.03), inset 0 0 60px rgba(0, 200, 255, 0.02)',
          cursor: 'pointer',
          display: 'block',
          width: '900px',
          height: '650px'
        }}
      />
      <ObjectInfo object={selectedObject} onClose={() => setSelectedObject(null)} />
    </>
  );
}