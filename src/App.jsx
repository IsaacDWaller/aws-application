import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import outputs from "../amplify_outputs.json";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

Amplify.configure({
  ...outputs,
  Auth: {
    Cognito: { allowGuestAccess: true },
  },
});

const client = generateClient();

export default function App() {
  const [counters, setCounters] = useState([]);

  useEffect(() => {
    getCounters();
  }, []);

  async function createCounter() {
    const response = await client.models.Counter.create(
      { value: 0 },
      { authMode: "identityPool" },
    );

    if (response.errors) {
      return;
    }

    setCounters(oldCounters => [...oldCounters, { id: response.data.id, value: response.data.value }]);
  }

  async function getCounters() {
    const response = await client.models.Counter.list({ authMode: "identityPool" });
    setCounters(response.data);
  }

  async function updateCounter(id, value) {
    const response = await client.models.Counter.update(
      { id, value },
      { authMode: "identityPool" },
    );

    if (response.error) {
      return;
    }

    setCounters(oldCounters => {
      const newCounters = [...oldCounters];
      newCounters.find(counter => counter.id === id).value = value;
      return newCounters;
    });
  }

  async function deleteCounter(id) {
    const response = await client.models.Counter.delete(
      { id },
      { authMode: "identityPool" },
    );

    if (response.error) {
      return;
    }

    setCounters(oldCounters => oldCounters.filter(counter => counter.id !== id));
  }

  const countersContent = counters.map(counter =>
    <li key={counter.id}>
      <button onClick={() => updateCounter(counter.id, counter.value + 1)}>count is {counter.value}</button>
      <button onClick={() => deleteCounter(counter.id)}>-</button>
    </li>
  );

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>

        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>AWS Application</h1>

      <div className="card">
        <ul>{countersContent}</ul>
        <button onClick={() => createCounter()}>+</button>
      </div>
    </>
  );
}