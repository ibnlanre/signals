import { describe, expect, test } from "vitest";
import { signal } from "./signal";

import { act, renderHook } from "@testing-library/react";

describe("signal", () => {
  test("should create a signal with the initial value", () => {
    const initialValue = 10;
    const s = signal(initialValue);
    expect(s.value).toBe(initialValue);
  });

  test("should update the value when assigned a new value", () => {
    const initialValue = 10;
    const newValue = 20;
    const s = signal(initialValue);
    s.value = newValue;
    expect(s.value).toBe(newValue);
  });

  test("should subscribe to the signal and update the state", () => {
    const initialValue = 10;
    const newValue = 20;

    const s = signal(initialValue);
    const { result } = renderHook(() => s.use());

    const [state, setter] = result.current;
    expect(state).toBe(initialValue);

    act(() => setter(newValue));
    expect(s.value).toBe(newValue);
  });

  test("should subscribe to the signal and update the selected state", () => {
    const initialValue = 10;
    const newValue = 20;

    const s = signal(initialValue);
    const { result } = renderHook(() => s.use((state) => state * 2));

    const [state, setter] = result.current;
    expect(state).toBe(initialValue * 2);

    act(() => setter(newValue));
    expect(s.value).toBe(newValue);
  });
});
