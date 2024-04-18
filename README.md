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

It is advisable to create a signal using the `signal` function, outside of a React component to avoid re-creating the signal on every render. The signal object can then be used within a React component using the `use` method. The `signal` function takes an initial value and returns a signal object, while the `use` method returns the current value and a setter function.

### Within a React component

```jsx
import { signal } from '@ibnlanre/signals';

const count = signal(0);

function Counter() {
  const [countValue, setCount] = count.use();

  return (
    <div>
      <p>{countValue}</p>
      <button onClick={() => { 
        setCount(prevCount => prevCount + 1) 
      }}>
        Increment
      </button>
    </div>
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

### Computed signals

It is also possible to create a `computed` signal, which depends on other signals. The `computed` function takes a function that returns a value, and an array of signals that the function depends on. The function is called whenever any of the signals change.

```typescript
import { computed } from '@ibnlanre/signals';

const count = signal(0);
const doubleCount = computed(() => c.value * 2, [c]);
```

A computed signal can be used in the same way as a regular signal. It can be used within a React component using the `use` method, or outside a React component using the `value` property. But it cannot be updated directly. Rather its value is derived from the signals it depends on.

```jsx
function DoubleCounter() {
  const [doubleCountValue, setDoubleCountValue] = doubleCount.use();

  useEffect(() => {
    console.log('doubleCount changed:', doubleCountValue);
  }, [doubleCountValue]);

  return (
    <div>
      <p>{doubleCountValue}</p>
      <button onClick={() => count.value--}>
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
const count = signal(0);
```

### `use`

The `use` method of the signal object returns the current value and a setter function. It is used within a React component.

```typescript
const [countValue, setCount] = count.use();
```

### `value`

The `value` property of the signal object returns the current value. It is used outside a React component.

```typescript
const countValue = count.value;
```

### `computed`

The `computed` function creates a computed signal. It takes a function that returns a value, and an array of signals that the function depends on.

```typescript
const doubleCount = computed([count], () => count.value * 2);
```

### `subscribe`

The `subscribe` method of the signal object is used to run a function whenever the signal changes. It takes a function and an optional `immediate` argument, which is `true` by default.

```typescript
count.subscribe((value) => {
  console.log('count changed:', value);
}, false);
```

### `effect`

The `effect` method of the signal object performs the same function as the `subscribe` method, but it should be used within a React component, as it is implemented using the `useEffect` hook. It takes a function and an optional `immediate` argument, which is `true` by default. While the `subscribe` method could be used within a React component, the `effect` method is recommended, as it is automatically cleaned up when the component is unmounted.

```typescript
count.effect((value) => {
  console.log('count value:', value);
});
```

## License

MIT
