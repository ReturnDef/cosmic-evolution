import SimulationCanvas from './components/SimulationCanvas';
import ControlPanel from './components/ControlPanel';
import StatisticsPanel from './components/StatisticsPanel';
import EventLogPanel from './components/EventLogPanel';
import { useSimulation } from './hooks/useSimulation';

function App() {
  const { universe, isRunning, start, pause, reset } = useSimulation(900, 650);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at 50% 50%, #0a0e1a 0%, #060810 50%, #000000 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Анимированные фоновые частицы */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(1px 1px at 10% 20%, rgba(100, 200, 255, 0.4), transparent),
            radial-gradient(1px 1px at 30% 60%, rgba(200, 150, 255, 0.3), transparent),
            radial-gradient(1px 1px at 50% 10%, rgba(100, 255, 200, 0.3), transparent),
            radial-gradient(1px 1px at 70% 80%, rgba(255, 200, 100, 0.3), transparent),
            radial-gradient(1px 1px at 90% 40%, rgba(255, 100, 200, 0.3), transparent),
            radial-gradient(2px 2px at 20% 80%, rgba(100, 200, 255, 0.1), transparent),
            radial-gradient(2px 2px at 80% 20%, rgba(200, 100, 255, 0.1), transparent)
          `,
          backgroundSize: '300px 300px',
          animation: 'twinkle 4s ease-in-out infinite alternate'
        }}
      />
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          padding: '20px'
        }}
      >
        {/* Левая колонка - статистика */}
        <div style={{ minWidth: '180px' }}>
          <StatisticsPanel universe={universe} />
        </div>

        {/* Центр - симуляция */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '8px 30px',
            background: 'rgba(10, 15, 30, 0.6)',
            borderRadius: '50px',
            border: '1px solid rgba(0, 200, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(0, 200, 255, 0.05)'
          }}>
            <span style={{ fontSize: '20px' }}>✦</span>
            <h1
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #00d4ff, #7b2ffc, #22c55e)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '6px',
                textShadow: '0 0 40px rgba(0, 212, 255, 0.2)',
                fontFamily: "'Segoe UI', Tahoma, sans-serif"
              }}
            >
              COSMIC EVOLUTION
            </h1>
            <span style={{ fontSize: '20px' }}>✦</span>
          </div>

          <SimulationCanvas universe={universe} />

          <ControlPanel
            isRunning={isRunning}
            onStart={start}
            onPause={pause}
            onReset={reset}
          />
        </div>

        {/* Правая колонка - лог событий */}
        <div style={{ minWidth: '340px' }}>
          <EventLogPanel />
        </div>
      </div>
    </div>
  );
}

export default App;