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

Within a React component, it is advisable to create a signal using the `signal` function. The `signal` function takes an initial value and returns a signal object. The signal object has a `use` method that returns the current value and a setter function.

### Within a React component

```jsx
import { signal } from '@ibnlanre/signals';

const count = signal(0);

function Counter() {
  const [countValue, setCount] = count.use();

  return (
    <div>
      <p>{countValue}</p>
      <button onClick={() => { setCount(c => ++c) }}>
        Increment
      </button>
    </div>
  );
}
```

### Outside a React component

Outside a React component, you can use the signal object directly. It could also be used within, but accessing the `.value` property directly is not recommended, as the value will not be updated when the signal changes, without a re-render.

```typescript
const count = signal(0);

const changeCount = () => count.value++;
```

### Computed signals

It is also possible to create a `computed` signal, which depends on other signals. The `computed` function takes a function that returns a value, and an array of signals that the function depends on. The function is called whenever any of the signals change.

```typescript
import { computed } from '@ibnlanre/signals';

const count = signal(0);
const doubleCount = computed([c], () => c.value * 2);
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

### `effect`

The `effect` method of the signal object is used to run a function whenever the signal changes. It takes a function and an optional `immediate` parameter, which is `true` by default.

```typescript
count.effect((value) => {
  console.log('count changed:', value);
}, false);
```

### `watch`

The `watch` method of the signal object is used to run a function whenever the signal changes. It takes a function and an optional `immediate` parameter, which is `true` by default.

```typescript

## License

MIT
