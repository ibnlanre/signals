import { useState } from "react";

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
   * Creates a new signal with an optional initial value.
   * @param {Value} [initialValue] The initial value of the signal.
   * @returns {Signal<Value>} The new signal.
   */
  constructor(initialValue: () => Value, dependencyList: DependencyList) {
    /**
     * Pass the current value of the signal to the parent class.
     */
    super(
      (() => {
        const eventTarget = new EventTarget();
        eventTarget.addEventListener("s!gN@l_3v3nT", (event) => {
          event.stopPropagation();

          const signal = (<CustomEvent>event).detail as Composite;
          signal.subscribe(() => {
            this.state = initialValue();
            this.subscribers.forEach((subscriber) => subscriber(this.state));
          });
        });

        return initialValue();
      })()
    );

    // /**
    //  * Subscribe to changes in the dependency signals.
    //  */
    // dependencyList.forEach((dependency) => {
    //   dependency.subscribe(() => {
    //     this.state = initialValue();
    //     this.subscribers.forEach((subscriber) => subscriber(this.state));
    //   });
    // });
  }

  /**
   * Retrieves the current value of the signal
   * @returns {Value} The current value.
   */
  use = <Select = Value>(
    selector: (state: Value) => Select = (state) => state as unknown as Select
  ) => {
    const [state, setState] = useState(this.state);
    this.effect(setState);
    return [selector(state)];
  };
}

/**
 * Creates a new signal with an optional initial value.
 *
 * @param initialValue The initial value of the signal.
 * @param dependencyList The list of signals that this signal depends on.
 *
 * @returns The new signal.
 */
export function computed<Value, const DependencyList extends CompositeArray>(
  initialValue: () => Value,
  dependencyList: DependencyList
): Computed<Value, DependencyList> {
  return new Computed(initialValue, dependencyList);
}

const eventTarget = new EventTarget();
eventTarget.addEventListener("s!gN@l_3v3nT", (event) => {
  event.stopPropagation();
});

// Dispatch the "s!gN@l_3v3nT" event
const event = new CustomEvent("s!gN@l_3v3nT", {
  bubbles: true,
  cancelable: true,
});
eventTarget.dispatchEvent(event);
