import { useEffect, useState } from 'react';
import { EventLog } from '../utils/EventLog';
import type { LogEvent } from '../utils/EventLog';

export default function EventLogPanel() {
  const [events, setEvents] = useState<LogEvent[]>([]);

  useEffect(() => {
    const log = EventLog.getInstance();
    setEvents(log.getEvents());

    const unsubscribe = log.subscribe(() => {
      setEvents(log.getEvents());
    });

    return () => unsubscribe();
  }, []);

  const getEventStyle = (type: LogEvent['type']) => {
    switch (type) {
      case 'birth': 
        return { 
          color: '#34d399', 
          borderLeft: '2px solid #34d399',
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.05)'
        };
      case 'death': 
        return { 
          color: '#f87171', 
          borderLeft: '2px solid #f87171',
          boxShadow: '0 0 20px rgba(248, 113, 113, 0.05)'
        };
      case 'season': 
        return { 
          color: '#60a5fa', 
          borderLeft: '2px solid #60a5fa',
          boxShadow: '0 0 20px rgba(96, 165, 250, 0.05)'
        };
      default: 
        return { 
          color: '#94a3b8', 
          borderLeft: '2px solid #334155',
          boxShadow: 'none'
        };
    }
  };

  const getEventIcon = (type: LogEvent['type']) => {
    switch (type) {
      case 'birth': return '✨';
      case 'death': return '💀';
      case 'season': return '🌍';
      default: return '📌';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div
      style={{
        background: 'rgba(10, 15, 30, 0.85)',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 40px rgba(0, 200, 255, 0.03)',
        width: '340px',
        height: '280px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>📋</span>
          <h3 style={{ 
            margin: 0, 
            fontSize: '13px', 
            color: '#00d4ff',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '600'
          }}>
            Event Log
          </h3>
          <span style={{ 
            fontSize: '10px', 
            color: '#667788',
            background: 'rgba(0, 200, 255, 0.1)',
            padding: '2px 10px',
            borderRadius: '20px'
          }}>
            {events.length}
          </span>
        </div>
        <button
          onClick={() => EventLog.getInstance().clear()}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '4px 14px',
            color: '#667788',
            cursor: 'pointer',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#667788';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          Clear
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
          fontSize: '12px'
        }}
      >
        {events.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#445566', 
            padding: '40px 20px',
            fontStyle: 'italic',
            fontSize: '13px'
          }}>
            <span style={{ fontSize: '30px', display: 'block', marginBottom: '12px' }}>🌌</span>
            No events yet...
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              style={{
                ...getEventStyle(event.type),
                padding: '8px 12px',
                marginBottom: '6px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                fontSize: '11px',
                transition: 'all 0.3s ease',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                e.currentTarget.style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span style={{ fontSize: '14px', marginTop: '1px' }}>
                {getEventIcon(event.type)}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: '#445566', 
                  fontSize: '9px', 
                  marginBottom: '2px',
                  letterSpacing: '0.5px'
                }}>
                  {formatTime(event.timestamp)}
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '11px', lineHeight: '1.4' }}>
                  {event.message}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}