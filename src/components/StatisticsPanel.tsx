import { Universe } from '../models/Universe';

type Props = {
  universe: Universe;
};

export default function StatisticsPanel({ universe }: Props) {
  const stats = [
    { 
      label: 'Galaxies', 
      value: universe.galaxyCount,
      icon: '🌌',
      gradient: 'linear-gradient(135deg, #00d4ff, #0066ff)',
      glow: 'rgba(0, 212, 255, 0.2)'
    },
    { 
      label: 'Stars', 
      value: universe.starCount,
      icon: '⭐',
      gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      glow: 'rgba(251, 191, 36, 0.2)'
    },
    { 
      label: 'Planets', 
      value: universe.planetCount,
      icon: '🪐',
      gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
      glow: 'rgba(167, 139, 250, 0.2)'
    },
    { 
      label: 'Life Worlds', 
      value: universe.lifeWorldsCount,
      icon: '🧬',
      gradient: 'linear-gradient(135deg, #34d399, #059669)',
      glow: 'rgba(52, 211, 153, 0.2)'
    },
    { 
      label: 'Civilizations', 
      value: universe.civilizationCount,
      icon: '🏛️',
      gradient: 'linear-gradient(135deg, #f472b6, #db2777)',
      glow: 'rgba(244, 114, 182, 0.2)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            background: 'rgba(10, 15, 30, 0.85)',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 30px ${stat.glow}`,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(4px)';
            e.currentTarget.style.borderColor = 'rgba(0, 200, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
          }}
        >
          {/* Фоновое свечение */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle, ${stat.glow}, transparent 70%)`,
              opacity: 0.3,
              pointerEvents: 'none'
            }}
          />
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>{stat.icon}</span>
              <span style={{ 
                fontSize: '11px', 
                color: '#8899aa',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '500'
              }}>
                {stat.label}
              </span>
            </div>
            <span style={{ 
              fontSize: '26px', 
              fontWeight: '700',
              background: stat.gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: `0 0 30px ${stat.glow}`
            }}>
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}