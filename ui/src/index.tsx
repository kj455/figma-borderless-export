import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';

const App = () => {
  const [count, setCount] = createSignal(0);

  return <button onClick={() => setCount((count) => count + 1)}>Count value is {count()}</button>;
};

render(() => <App />, document.getElementById('root')!);
