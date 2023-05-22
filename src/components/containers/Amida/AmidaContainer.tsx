import "./index.css";
import { FC } from "react";
import { AmidaPresenter } from "./AmidaPresenter";

interface Props {
  items: string[];
  onStop: (result: string) => void;
}
export const AmidaContainer: FC<Props> = ({ items, onStop }) => {
  return (
    <section className="amidaContainer">
      <AmidaPresenter items={items} onStop={onStop} />
    </section>
  );
};
