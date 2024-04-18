import { useEffect } from "react";

/**
 * Represents a signal that maintains a current value and emits it to subscribers.
 * @template Value The type of the initial value.
 */
export class Sample<Value> {
  /**
   * The current value of the signal.
   * @protected
   * @type {Value}
   */
  protected state: Value = undefined as Value;

  /**
   * The set of subscribers to the signal.
   * @protected
   * @type {Set<(data: Value) => void>}
   */
  protected subscribers: Set<(data: Value) => void> = new Set();

  /**
   * Creates a new signal with an optional initial value.
   * @param {Value} [initialValue=undefined] The initial value of the signal.
   * @returns {Signal<Value>} The new signal.
   */
  constructor(initialValue: Value = undefined as Value) {
    this.state = initialValue;
  }

  /**
   * Subscribes to changes in the signal.
   *
   * @param {Function} callback The callback function to execute when the signal changes.
   * @param {boolean} [immediate=true] Whether to run the callback immediately with the current state. Defaults to `true`.
   *
   * @description
   * When immediate is true, the callback will execute immediately with the current state.
   * When immediate is false or not provided, the callback will only execute after a change has occurred.
   *
   * @returns {Function} A function to unsubscribe the callback.
   */
  subscribe = (callback: (value: Value) => void, immediate = true) => {
    const unsubscribe = () => {
      this.subscribers.delete(callback);
    };

    if (this.subscribers.has(callback)) return unsubscribe;
    if (immediate) callback(this.state);

    this.subscribers.add(callback);
    return unsubscribe;
  };

  /**
   * Subscribes to changes in the signal using the `useEffect` hook.
   *
   * @param {Function} callback The callback function to execute when the signal changes.
   * @param {boolean} [immediate=true] Whether to run the callback immediately with the current state. Defaults to `true`.
   *
   * @returns {void}
   */
  effect = (callback: (value: Value) => void, immediate = true) => {
    useEffect(this.subscribe(callback, immediate), []);
  };
}
