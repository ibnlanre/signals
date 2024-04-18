import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { signal } from "../signal";
import { Computed, computed } from "./computed";

describe("Computed", () => {
  test("should return the current value of the signal", () => {
    const a = signal(4);
    const b = new Computed(() => a.value + 2, [a]);
    expect(b.value).toBe(6);
  });

  test("should update the value when dependencies change", () => {
    const b = signal(3);
    const c = new Computed(() => b.value + 2, [b]);

    expect(c.value).toBe(5);

    b.value = 10;
    expect(c.value).toBe(12);
  });

  test("should use the selector function to transform the state", () => {
    const c = signal(6);
    const d = new Computed(() => c.value - 2, [c]);

    expect(d.value).toEqual(4);

    const selector = (state: number) => state * 2;
    const { result } = renderHook(() => d.use(selector));

    const [selected] = result.current;
    expect(selected).toEqual(8);
  });
});

describe("computed", () => {
  test("should return the current value of the signal", () => {
    const a = signal(4);
    const b = computed(() => a.value + 2, [a]);
    expect(b.value).toBe(6);
  });

  test("should update the value when dependencies change", () => {
    const b = signal(3);
    const c = computed(() => b.value + 2, [b]);

    expect(c.value).toBe(5);

    b.value = 10;
    expect(c.value).toBe(12);
  });

  test("should use the selector function to transform the state", () => {
    const c = signal(7);

    const d = computed(() => c.value - 1, [c]);
    expect(d.value).toEqual(6);

    const e = computed(() => d.value * 2, [d]);
    expect(e.value).toEqual(12);

    const selector = (state: number) => state / 3;
    const { result } = renderHook(() => d.use(selector));

    const [f] = result.current;
    expect(f).toEqual(2);

    act(() => {
      c.value = 7;
    });

    expect(c.value).toEqual(7);
    expect(d.value).toEqual(6);
    expect(e.value).toEqual(12);

    const [g] = result.current;
    expect(g).toEqual(2);
  });
});
