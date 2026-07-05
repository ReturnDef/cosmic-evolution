type Props = {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export default function ControlPanel({ isRunning, onStart, onPause, onReset }: Props) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '12px', 
      marginTop: '4px',
      padding: '8px',
      background: 'rgba(10, 15, 30, 0.5)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)'
    }}>
      <button
        style={{
          padding: '10px 28px',
          borderRadius: '8px',
          border: 'none',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          transition: 'all 0.3s ease',
          opacity: isRunning ? 0.4 : 1,
          background: isRunning 
            ? 'rgba(34, 197, 94, 0.15)' 
            : 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: isRunning ? '#22c55e' : '#ffffff',
          boxShadow: isRunning 
            ? 'none' 
            : '0 0 30px rgba(34, 197, 94, 0.25)',
          border: isRunning ? '1px solid rgba(34, 197, 94, 0.2)' : 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={onStart}
        disabled={isRunning}
        onMouseEnter={(e) => {
          if (!isRunning) {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(34, 197, 94, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isRunning) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.25)';
          }
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>▶</span> Start
        </span>
      </button>

      <button
        style={{
          padding: '10px 28px',
          borderRadius: '8px',
          border: 'none',
          cursor: !isRunning ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          transition: 'all 0.3s ease',
          opacity: !isRunning ? 0.4 : 1,
          background: !isRunning 
            ? 'rgba(245, 158, 11, 0.15)' 
            : 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: !isRunning ? '#f59e0b' : '#ffffff',
          boxShadow: !isRunning 
            ? 'none' 
            : '0 0 30px rgba(245, 158, 11, 0.25)',
          border: !isRunning ? '1px solid rgba(245, 158, 11, 0.2)' : 'none'
        }}
        onClick={onPause}
        disabled={!isRunning}
        onMouseEnter={(e) => {
          if (isRunning) {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(245, 158, 11, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (isRunning) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.25)';
          }
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⏸</span> Pause
        </span>
      </button>

      <button
        style={{
          padding: '10px 28px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#ffffff',
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)'
        }}
        onClick={onReset}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 0 40px rgba(239, 68, 68, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.2)';
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⟳</span> Reset
        </span>
      </button>
    </div>
  );
}