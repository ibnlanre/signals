import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { Sample } from "../sample";

export function isSetStateFunction<State>(
  value: SetStateAction<State>
): value is (prevState: State) => State {
  return typeof value === "function";
}

/**
 * A signal that emits a value and notifies subscribers.
 */
export class Signal<Value> extends Sample<Value> {
  /**
   * Emits a new value to the signal and notifies subscribers.
   * @param {Value} newValue The new value to emit.
   * @returns {void}
   */
  set value(newValue: Value) {
    this.state = newValue;
    this.subscribers.forEach((callback) => {
      callback(newValue);
    });
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
  use = <Select = Value>(
    selector: (state: Value) => Select = (state) => state as unknown as Select
  ): [Select, Dispatch<SetStateAction<Value>>] => {
    const [state, setState] = useState(this.state);
    this.effect(setState);

    const setter: Dispatch<SetStateAction<Value>> = (value) => {
      if (isSetStateFunction(value)) {
        this.value = value(this.state);
      } else this.value = value;
    };

    const selected = selector(state);
    return [selected, setter];
  };
}

/**
 * Creates a new signal with an optional initial value.
 * @template Value The type of the initial value.
 *
 * @param {Value} [initialValue] The initial value of the signal.
 * @returns {Signal<Value>} The new signal.
 */
export function signal<Value>(initialValue: Value): Signal<Value> {
  return new Signal(initialValue);
}
