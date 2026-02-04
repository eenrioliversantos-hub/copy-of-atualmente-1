type EventHandler = (data?: any) => void;

class EventEmitter {
  private events: { [key: string]: EventHandler[] } = {};

  subscribe(eventName: string, handler: EventHandler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
  }

  unsubscribe(eventName: string, handler: EventHandler) {
    if (!this.events[eventName]) return;

    this.events[eventName] = this.events[eventName].filter(h => h !== handler);
  }

  publish(eventName: string, data?: any) {
    if (!this.events[eventName]) return;

    this.events[eventName].forEach(handler => handler(data));
  }
}

// Singleton instance
const eventEmitter = new EventEmitter();

export const EventTypes = {
    TASK_COMPLETED: 'TASK_COMPLETED',
    NAVIGATE_TO_TASK: 'NAVIGATE_TO_TASK',
    DPO_UPDATED: 'DPO_UPDATED',
};


export default eventEmitter;
