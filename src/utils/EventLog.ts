/**
 * EventLog.ts
 * Синглтон для логирования событий
 */

export type LogEvent = {
  id: number;
  timestamp: number;
  message: string;
  type: 'birth' | 'death' | 'eat' | 'season' | 'info';
};

export class EventLog {
  private static instance: EventLog;
  private events: LogEvent[] = [];
  private maxSize: number = 100;
  private nextId: number = 1;
  private listeners: (() => void)[] = [];

  private constructor() {}

  static getInstance(): EventLog {
    if (!EventLog.instance) {
      EventLog.instance = new EventLog();
    }
    return EventLog.instance;
  }

  addEvent(message: string, type: LogEvent['type'] = 'info') {
    this.events.unshift({
      id: this.nextId++,
      timestamp: Date.now(),
      message,
      type
    });
    if (this.events.length > this.maxSize) {
      this.events.pop();
    }
    this.notify();
  }

  getEvents(): LogEvent[] {
    return [...this.events];
  }

  clear() {
    this.events = [];
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}