import { useEffect, useState } from "react";

import { Sample } from "../sample";
import { Signal } from "../signal";

export type Composite = Signal<any> | Computed<any, any>;
export type CompositeArray = Array<Composite>;

/**
 * A signal that is derived from other signals.
 */
export class Computed<
  Value,
  const DependencyList extends CompositeArray
> extends Sample<Value> {
  /**
   * Returns the current value of the signal.
   * @returns {Value} The current value.
   */
  get value() {
    return this.state;
  }

  /**
   * Creates a new signal with an optional initial value.
   * @param {Value} [initialValue] The initial value of the signal.
   * @returns {Signal<Value>} The new signal.
   */
  constructor(initialValue: () => Value, dependencyList: DependencyList) {
    /**
     * Pass the current value of the signal to the parent class.
     */
    super(initialValue());

    /**
     * Subscribe to changes in the dependency signals.
     */
    dependencyList.forEach((dependency) => {
      dependency.subscribe(() => {
        this.state = initialValue();
        this.subscribers.forEach((subscriber) => subscriber(this.state));
      });
    });
  }

  /**
   * Retrieves the current value of the signal
   * @returns {Value} The current value.
   */
  use = <Select>(
    selector: (state: Value) => Select = (state) => state as unknown as Select
  ) => {
    const [state, setState] = useState(this.state);
    useEffect(this.subscribe(setState), []);
    return selector(state);
  };
}

/**
 * Creates a new signal with an optional initial value.
 *
 * @param dependencyList The list of signals that this signal depends on.
 * @param initialValue The initial value of the signal.
 *
 * @returns The new signal.
 */
export function computed<Value, const DependencyList extends CompositeArray>(
  initialValue: () => Value,
  dependencyList: DependencyList
): Computed<Value, DependencyList> {
  return new Computed(initialValue, dependencyList);
}
