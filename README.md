# Signals

A simple reactive state management library for React, built with hooks. It's inspired by [Solid JS](https://www.solidjs.com/) and [Preact's signals API](https://preactjs.com/guide/v10/signals/).

## Installation

```bash
# if you're using npm
npm install @ibnlanre/signals

# if you're using yarn
yarn add @ibnlanre/signals
```

## Usage

To create a signal, import the `signal` function from the package, and call it with a value. Whatever value is passed to the `signal` function will be the initial value of the signal. An initial value is necessary to help the signal pre-empt the type of value it will be dealing with. The type of the initial value becomes the type of the signal.

### Within a React component

It is advisable to create a signal using the `signal` function, outside of a React component to avoid re-creating the signal on every render. The `signal` function takes an initial value and returns a signal object. The signal object contains methods for subscribing to changes, and updating the value.

```typescript
import { signal } from '@ibnlanre/signals';

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

Because calling the `use` hook implements the useState hook, the reactivity pattern can be used to update the signal value directly. This is useful when the setter function is not needed. It works by calling the `use` hook in the component body, without destructuring the return value. Accessing the value of the signal can be achieved by calling the `value` property of the signal object.

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

Outside a React component, you can use the signal object directly. It could also be used within, but accessing the `.value` property directly is not recommended, as the value will not be updated when the signal changes, without a re-render. The issue of the value not updating does not exist outside a React component.

```typescript
const count = signal(0);

const increment = () => count.value++;
const decrement = () => { 
  count.value = count.value - 1 
};
```

### Asynchronous Values

Signals can also be used to store awaited values. The `signal` function can be called with an awaited promise, and the signal will be updated with the resolved value of the promise. This is useful when fetching data from an API. This method does not require a function as the initial value, and the value will be inferred from the resolved value of the promise, if it is typed.

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

It is also possible to create a `computed` signal, which depends on other signals. The `computed` function takes a function that returns a value, and an array of signals that the function depends on. The function is called whenever any of the signals change.

```typescript
import { computed } from '@ibnlanre/signals';

const countSignal = signal(1);
const doubleCountSignal = computed(() => {
  return countSignal.value * 2
}, [countSignal]);
```

A computed signal can be used in the same way as a regular signal. It can be used within a React component using the `use` method, or outside a React component using the `value` property. But it cannot be updated directly. Rather its value is derived from the signals it depends on.

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
