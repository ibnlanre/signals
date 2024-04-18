import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { Sample } from "../sample";

/**
 * A signal that emits a value and notifies subscribers.
 */
export class Signal<Value> extends Sample<Value> {
  /**
   * Returns the current value of the signal.
   * @returns {Value} The current value.
   */
  get value() {
    return this.state;
  }

  /**
   * Emits a new value to the signal and notifies subscribers.
   * @param {Value} newValue The new value to emit.
   * @returns {void}
   */
  set value(newValue: Value) {
    this.state = newValue;
    this.subscribers.forEach((fn) => fn(this.state));
  }

  /**
   * Creates a new signal with an optional initial value.
   * @param {Value} [initialValue] The initial value of the signal.
   * @returns {Signal<Value>} The new signal.
   */
  constructor(initialValue: Value) {
    super(initialValue);
  }

  /**
   * Retrieves the current value of the signal and a setter function to update the value.
   * @returns {[Value, Dispatch<SetStateAction<Value>>]} The current value and a setter function.
   */
  use = <Select>(
    selector: (state: Value) => Select = (state) => state as unknown as Select
  ) => {
    const [state, setState] = useState(this.state);
    useEffect(this.subscribe(setState), []);

    const setter: Dispatch<SetStateAction<Value>> = (value) => {
      if (typeof value === "function") {
        this.value = (value as (value: Value) => Value)(this.state);
      } else this.value = value as Value;
    };

    const selectedState = selector(state);
    return [selectedState, setter] as [Select, Dispatch<SetStateAction<Value>>];
  };
}

/**
 * Creates a new signal with an optional initial value.
 * @template Value The type of the initial value.
 *
 * @param {Value | () => Value} [initialValue] The initial value of the signal or a function to generate the initial value.
 * @returns {Signal<Value> | Computed<Value>} The new signal.
 */
export function signal<Value>(initialValue: Value): Signal<Value> {
  return new Signal(initialValue);
}
