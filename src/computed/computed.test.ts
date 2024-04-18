import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { signal } from "../signal";
import { Computed, computed } from "./computed";

describe("Computed", () => {
  test("should return the current value of the signal", () => {
    const a = signal(4);
    const computed = new Computed([a], (a) => a.value + 2);
    expect(computed.value).toBe(6);
  });

  test("should update the value when dependencies change", () => {
    const b = signal(3);
    const computed = new Computed([b], (b) => b.value + 2);

    expect(computed.value).toBe(5);

    b.value = 10;
    expect(computed.value).toBe(12);
  });

  test("should use the selector function to transform the state", () => {
    const c = signal(6);
    const computed = new Computed([c], (c) => c.value - 2);

    expect(computed.value).toEqual(4);

    const selector = (state: number) => state * 2;
    const { result } = renderHook(() => computed.use(selector));

    expect(result.current).toEqual(8);
  });
});

describe("computed", () => {
  test("should return the current value of the signal", () => {
    const a = signal(4);
    const computedValue = computed([a], (a) => a.value + 2);
    expect(computedValue.value).toBe(6);
  });

  test("should update the value when dependencies change", () => {
    const b = signal(3);
    const computedValue = computed([b], (b) => b.value + 2);

    expect(computedValue.value).toBe(5);

    b.value = 10;
    expect(computedValue.value).toBe(12);
  });

  test("should use the selector function to transform the state", () => {
    const c = signal(6);
    const computedValue = computed([c], (c) => c.value - 2);

    expect(computedValue.value).toEqual(4);

    const selector = (state: number) => state * 2;
    const { result } = renderHook(() => computedValue.use(selector));

    expect(result.current).toEqual(8);
  });
});
