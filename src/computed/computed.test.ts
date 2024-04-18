import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { signal } from "../signal";
import { Computed, computed } from "./computed";

describe("Computed", () => {
  test("should return the current value of the signal", () => {
    const a = signal(4);
    const computed = new Computed(() => a.value + 2, [a]);
    expect(computed.value).toBe(6);
  });

  test("should update the value when dependencies change", () => {
    const b = signal(3);
    const computed = new Computed(() => b.value + 2, [b]);

    expect(computed.value).toBe(5);

    b.value = 10;
    expect(computed.value).toBe(12);
  });

  test("should use the selector function to transform the state", () => {
    const c = signal(6);
    const computed = new Computed(() => c.value - 2, [c]);

    expect(computed.value).toEqual(4);

    const selector = (state: number) => state * 2;
    const { result } = renderHook(() => computed.use(selector));

    expect(result.current).toEqual(8);
  });
});

describe("computed", () => {
  test("should return the current value of the signal", () => {
    const a = signal(4);
    const computedValue = computed(() => a.value + 2, [a]);
    expect(computedValue.value).toBe(6);
  });

  test("should update the value when dependencies change", () => {
    const b = signal(3);
    const computedValue = computed(() => b.value + 2, [b]);

    expect(computedValue.value).toBe(5);

    b.value = 10;
    expect(computedValue.value).toBe(12);
  });

  test("should use the selector function to transform the state", () => {
    const c = signal(6);
    const d = computed(() => c.value - 2, [c]);
    const e = computed(() => d.value * 2, [d]);

    expect(d.value).toEqual(4);
    expect(e.value).toEqual(8);

    const selector = (state: number) => state * 2;
    const { result, rerender } = renderHook(() => d.use(selector));
    expect(result.current).toEqual(8);

    act(() => {
      c.value = 5;
      rerender();
    });

    expect(result.current).toEqual(6);
    expect(e.value).toEqual(6);
  });
});
