import "./global.css";
import "./app.css";
import { FC, FormEvent, StrictMode, useCallback, useState } from "react";
import ReactDOM from "react-dom/client";
import { Amida } from "./components/containers/Amida";
import { Roulette } from "./components/containers/Roulette";
import { ModeSelector } from "./components/ui/ModeSelector";

const modes = [
  { name: "Amida", value: "amida" },
  { name: "Bingo", value: "bingo" },
  { name: "Roulette", value: "roulette" },
] as const;

const App: FC = () => {
  const [mode, setMode] = useState<(typeof modes)[number]["value"]>(
    modes[0].value
  );
  const [items, setItems] = useState<string[]>([""]);
  const [result, setResult] = useState("");

  const handleOnInput = useCallback((e: FormEvent<HTMLTextAreaElement>) => {
    setItems(e.currentTarget.value.split(/\r?\n/g).map((item) => item.trim()));
  }, []);

  const handleOnStop = useCallback((result: string) => {
    setResult(result);
  }, []);

  const handleOnSelect = useCallback(
    (value: (typeof modes)[number]["value"]) => setMode(value),
    []
  );

  return (
    <>
      <h1>{`The winner is ${result}`}</h1>
      <ModeSelector items={modes} onChange={handleOnSelect} />

      {mode === "amida" && <Amida items={items} onStop={handleOnStop} />}
      {mode === "roulette" && <Roulette items={items} onStop={handleOnStop} />}

      <textarea
        className="participants"
        cols={30}
        rows={10}
        onInput={handleOnInput}
      ></textarea>
    </>
  );
};

ReactDOM.createRoot(document.querySelector("#app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
