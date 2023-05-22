import "./index.css";
import { FC, useEffect, useRef } from "react";
import { useCanvas } from "../../../hooks/useCanvas";

const colors = [
  "#C25451",
  "#FFA500",
  "#9AA813",
  "#3E9A4C",
  "#00826E",
  "#006572",
  "#2F4858",
];
const padding = 0;
const duration = 10;
const hz = 60;
const radius = 360 - padding;

const random = () => Math.floor(Math.random() * 100) / 100;

interface Props {
  items: string[];
  onStop: (result: string) => void;
}

export const RoulettePresenter: FC<Props> = ({ items, onStop }) => {
  const { element, ref } = useCanvas();
  const animationFrameId = useRef(0);
  const result = useRef("");
  const frames = useRef(0);
  const tension = useRef(random());

  useEffect(() => {
    drawPie(0);
  }, [items]);

  const handleOnStop = () => {
    onStop(result.current);
    cancelAnimationFrame(animationFrameId.current);
    frames.current = 0;
  };

  const handleOnStart = () => {
    frames.current = 0;
    tension.current = random();
    animateRotation();
  };

  const animateRotation = () => {
    if (frames.current >= duration * hz) {
      handleOnStop();
      return;
    }
    frames.current++;
    drawPie(frames.current);
    animationFrameId.current = requestAnimationFrame(animateRotation);
  };

  const drawPie = (t: number) => {
    if (!ref.current) {
      return;
    }
    const context = ref.current.getContext("2d")!;

    const { width } = ref.current.getBoundingClientRect();
    ref.current.width = width;
    ref.current.height = width;

    const posX = width / 2;
    const posY = width / 2;
    const minimumAngle = (Math.PI * 2) / (items.length || 1);

    const progress = t / (duration * hz);

    items.forEach((_, index) => {
      const start =
        index * minimumAngle -
        easeInOutQuart(progress) *
          100 *
          (progress > 0.5 ? tension.current + 1 : 1);
      const end = start + minimumAngle;

      context.beginPath();
      context.moveTo(posX, posY);
      context.fillStyle = colors[index % 7];
      context.arc(posX, posY, radius, start, end);
      context.fill();

      context.arc(posX, posY, radius, start, end);
      drawText(start + minimumAngle / 2, items[index]);

      const startX = posX + Math.cos(start) * radius;
      const endX = posX + Math.cos(end) * radius;

      if (startX < posX && posX < endX) {
        result.current = items[index];
      }
    });
  };

  const drawText = (angle: number, text: string) => {
    if (!ref.current) {
      return;
    }
    const context = ref.current.getContext("2d")!;

    const { width } = ref.current.getBoundingClientRect();
    const posX = width / 2;
    const posY = width / 2;

    context.textAlign = "center";
    context.fillStyle = "white";
    context.font = "32px bold";

    context.fillText(
      text,
      posX + (Math.cos(angle) * radius) / 1.6,
      posY + (Math.sin(angle) * radius) / 1.6
    );
  };

  return (
    <div className="roulette">
      <div className="roulette_pin"></div>
      <div className="roulette__canvasContainer">{element}</div>
      <button onClick={handleOnStart}>start</button>
      <button onClick={handleOnStop}>remove</button>
    </div>
  );
};

function easeInOutQuart(x: number): number {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}
