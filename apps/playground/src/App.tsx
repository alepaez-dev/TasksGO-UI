import { useState } from 'react';
import { Button } from '@all3hp/tasksgo-ui';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>@all3hp/tasksgo-ui — Playground</h1>

      <section className="section">
        <h2>Button</h2>
        <div className="row">
          <Button onClick={() => setCount((c) => c + 1)}>
            Count: {count}
          </Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </section>

      <section className="section">
        <h2>Sizes</h2>
        <div className="row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
        </div>
      </section>

      <section className="section">
        <h2>Disabled</h2>
        <div className="row">
          <Button disabled>Primary disabled</Button>
          <Button variant="secondary" disabled>Secondary disabled</Button>
        </div>
      </section>
    </div>
  );
}

export default App;
