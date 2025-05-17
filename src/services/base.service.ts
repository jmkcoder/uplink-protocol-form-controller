
/**
 * Base class for reactive services.
 * Provides common state management and subscription functionality for all derived services.
 * 
 * @typeParam T - The type of data managed by this service
 */
export class BaseService<T> {
  /** The current value of the service state */
  protected current: T;
  
  /** Array of callback functions subscribed to state changes */
  protected _callbacks: ((value: T) => void)[] = [];

  /**
   * Creates a new BaseService instance
   * 
   * @param initialValue - The initial state value
   */
  constructor(initialValue: T) {
    this.current = initialValue;
  }

  /**
   * Subscribe to changes in the service value.
   * Callback is immediately invoked with the current value.
   * 
   * @param callback - Function to be called when value changes
   * @returns An unsubscribe function that removes this subscription
   */
  subscribe(callback: (value: T) => void) {
    this._callbacks.push(callback);
    // Immediately invoke with current value
    callback(this.current);
    return () => {
      this._callbacks = this._callbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Update the service value and notify all subscribers.
   * 
   * @param value - New value to set
   */
  set(value: T) {
    this.current = value;
    if (this._callbacks && this._callbacks.length) {
      this._callbacks.forEach((callback) => callback(value));
    }
  }

  /**
   * Get the current value
   * @returns Current value
   */
  get(): T {
    return this.current;
  }
}
