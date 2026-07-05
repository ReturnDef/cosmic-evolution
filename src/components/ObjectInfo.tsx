type Props = {
  object: any;
  onClose: () => void;
};

export default function ObjectInfo({ object, onClose }: Props) {
  if (!object) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        background: 'rgba(10, 15, 30, 0.92)',
        borderRadius: '12px',
        padding: '18px 24px',
        border: '1px solid rgba(0, 200, 255, 0.3)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 40px rgba(0, 200, 255, 0.1)',
        zIndex: 1000,
        minWidth: '260px',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ 
          margin: 0, 
          color: '#00d4ff',
          fontSize: '16px',
          fontWeight: '600',
          letterSpacing: '1px'
        }}>
          {object.type} {object.id}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(0, 200, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            color: '#8899aa',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 200, 255, 0.1)';
            e.currentTarget.style.color = '#8899aa';
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
        {Object.entries(object.data).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ color: '#8899aa' }}>{key}:</span>
            <span style={{ color: '#22c55e', fontWeight: '500' }}>{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}