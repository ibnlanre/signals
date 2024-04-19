# Signals

A simple reactive state management library for React, built with hooks. It's inspired by [Solid JS](https://www.solidjs.com/docs/latest/api#createsignal) and [Preact's signals API](https://preactjs.com/guide/v10/signals/).

## Installation

```bash
# if you're using npm
npm install @ibnlanre/signals

# if you're using yarn
yarn add @ibnlanre/signals
```

## Usage

To create a signal, import the `signal` function from the package, and call it with a value. Whatever value is passed to the `signal` function will be the initial value of the signal. An initial value is necessary to help the signal pre-empt the type of value it will be dealing with. The type of the initial value becomes the type of the signal. If a function is passed as the initial value, the signal's value becomes the function itself.

```typescript
import { signal } from '@ibnlanre/signals';
```

### Within a React component

The `signal` function takes an initial value and returns a signal object. The signal object contains methods for subscribing to changes, and updating the value. It is however advisable to create a signal using outside a React component to avoid re-creating the signal on every render. This is the only caveat to using signals, and it doesn't require a traking scope or a defined context to function. The value of the signal can also be accessed or updated anywhere in the application.

```typescript
const countSignal = signal(0);
```

#### Using the hooks pattern

Signals created should be used within a React component using the `use` method. The `use` method returns the current value and a setter function. The setter function can be called with a new value, or a function that takes the previous value and returns a new value.

```jsx
function Counter() {
  const [count, setCount] = countSignal.use();

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => { 
        setCount(prevCount => prevCount + 1) 
      }}>
        Increment
      </button>
    </div>
  );
}
```

#### Using the reactivity pattern

A re-render on signal change can be achieved by calling the `use` method within a React component. This is useful when the setter function is not needed. It works by calling the `use` hook in the component body, without destructuring the return value. Accessing the value of the signal can then be achieved by calling the `value` property of the signal object. The value of the signal can also be updated directly, and the component will re-render.

```jsx
function Counter() {
  count.use();

  return (
    <button onClick={() => count.value++}>
      {count.value}
    </button>
  );
}
```

### Outside a React component

Outside a React component, you can use the signal object directly. The exceptions are the `use` method and the `effect` method, which are implemented using the `useState` and `useEffect` hooks respectively. The `value` property of the signal object can be used to access the current value, as well as to update the value. Likewise, the `subscribe` method can be used to run a function whenever the signal changes.

```typescript
const count = signal(0);

const increment = () => count.value++;
const decrement = () => { 
  count.value = count.value - 1 
};
```

### Asynchronous Values

Signals can be used to store awaited values. In a scenario where the value of a signal is to be fetched asynchronously, the `signal` function can be called with an awaited promise. The signal will be updated with the resolved value of the promise. This is useful when fetching data from an API. The type of the signal is inferred from the resolved value of the promise, **if it is typed**.

```typescript
type Octocat = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  followers: number
  url: string
};

const url = "https://api.github.com/users/octocat";
const octocat = signal(await fetch(url).then<Octocat>((res) => res.json()));
```

### Computed signals

A value of a signal can be derived from other signals. When a signal depends on another signal, it is said to be computed. Creating a computed signal requires the `computed` function.

```typescript
import { computed } from '@ibnlanre/signals';
```

The `computed` function takes a callback that returns a value, and an array of signals that the callback depends on. Whenever the signals it depends on change, the callback is called, and the value of the computed signal is updated. A computed signal can also be dependent on another computed signal. The dependency tree is automatically managed by the library.

```typescript
const countSignal = signal(1);

const doubleCountSignal = computed(() => {
  return countSignal.value * 2
}, [countSignal]);
```

A computed signal can be used in the same way as a regular signal. It can be used within a React component using the `use` method, or outside a React component using the `value` property. The value of a computed signal is read-only, and cannot be updated directly. Rather its value is derived from the signals it depends on.

```jsx
function DoubleCounter() {
  const [doubleCount] = doubleCountSignal.use();

  useEffect(() => {
    console.log('doubleCount changed:', doubleCount);
  }, [doubleCount]);

  return (
    <div>
      <p>{doubleCount}</p>
      <button onClick={() => countSignal.value--}>
        Decrement
      </button>
    </div>
  );
}
```

## API

### `signal`

The `signal` function creates a signal object. It takes an initial value and returns a signal object.

```typescript
const countSignal = signal(0);
```

### `use`

The `use` method of the signal object returns the current value and a setter function. It is used within a React component.

```typescript
const [count, setCount] = countSignal.use();
```

### `value`

The `value` property of the signal object returns the current value. It is used outside a React component.

```typescript
const count = countSignal.value;
```

### `computed`

The `computed` function creates a computed signal. It takes a function that returns a value, and an array of signals that the function depends on.

```typescript
const doubleSignal = computed(() => countSignal.value * 2, [countSignal]);
```

### `subscribe`

The `subscribe` method of the signal object is used to run a function whenever the signal changes. It takes a function and an optional `immediate` argument, which is `true` by default.

```typescript
countSignal.subscribe((value) => {
  console.log('count changed:', value);
}, false);
```

### `effect`

The `effect` method of the signal object performs the same function as the `subscribe` method, but it should be used within a React component, as it is implemented using the `useEffect` hook. It takes a function and an optional `immediate` argument, which is `true` by default. While the `subscribe` method could be used within a React component, the `effect` method is recommended, as it is automatically cleaned up when the component is unmounted.

```typescript
countSignal.effect((value) => {
  console.log('count value:', value);
});
```

## License

MIT
