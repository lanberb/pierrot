import "./index.css";
import { FC } from "react";
import { RoulettePresenter } from "./RoulettePresenter";

interface Props {
  items: string[];
  onStop: (result: string) => void;
}
export const RouletteContainer: FC<Props> = ({ items, onStop }) => {
  return (
    <section className="rouletteContainer">
      <RoulettePresenter items={items} onStop={onStop} />
    </section>
  );
};
