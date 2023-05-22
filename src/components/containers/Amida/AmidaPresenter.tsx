import "./index.css";
import { FC, useEffect, useRef } from "react";
import { useCanvas } from "../../../hooks/useCanvas";

const padding = 40;
const duration = 10;
const hz = 60;

const random = () => Math.floor(Math.random() * 100) / 100;

interface Props {
  items: string[];
  onStop: (result: string) => void;
}

export const AmidaPresenter: FC<Props> = ({ items, onStop }) => {
  const { element, ref } = useCanvas();
  const animationFrameId = useRef(0);
  const result = useRef("");
  const frames = useRef(0);
  const tension = useRef(random());
  const lotteryPosXArray: number[] = [];

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
    animationFrameId.current = requestAnimationFrame(animateRotation);
  };

  const drawLottery = () => {
    if (!ref.current) {
      return;
    }

    const bridgePosYArray: { [key: string]: number[] } = {};
    const context = ref.current.getContext("2d")!;
    const { width, height } = ref.current.getBoundingClientRect();
    ref.current.width = width;
    ref.current.height = height;

    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineWidth = 4;
    context.strokeStyle = "#555";
    context.textAlign = "center";

    const gap = (width - 4) / (items.length + 1);
    const marginLeft = (width - gap * (items.length - 1)) / 2;

    items.forEach((item, index) => {
      const posX = Math.round(marginLeft + gap * index);
      lotteryPosXArray.push(posX);
      context.moveTo(posX, padding);
      context.lineTo(posX, height - padding);
      context.stroke();

      const a2d = ref.current?.getContext("2d")!;
      a2d.globalCompositeOperation = "destination-over";
      a2d.font = "32px bold";
      a2d.fillText(item, posX, 80);
    });
    lotteryPosXArray.forEach((posX, index, arr) => {
      if (!arr[index + 1]) {
        return;
      }
      if (arr.length === 1) {
        Object.keys(bridgePosYArray).forEach(
          (key) => delete bridgePosYArray[key]
        );
      }
      bridgePosYArray[index] = new Array();

      [...Array(5)].forEach(() => {
        let posY = Math.floor(random() * (height - padding * 2) + padding);
        if (
          Object.values(bridgePosYArray)
            .flat()
            .some((v) => posY === v)
        ) {
          console.log("ok");
          posY = posY + 20;
        }
        bridgePosYArray[index].push(posY);

        context.moveTo(posX, posY);
        context.lineTo(arr[index + 1], posY);
        context.stroke();
      });
      console.log(bridgePosYArray);
    });
    context.closePath();
  };

  const drawLots = () => {};

  useEffect(() => {
    drawLottery();
  }, [items]);

  return (
    <>
      <div className="amida__canvasContainer">{element}</div>
      <button onClick={handleOnStart}>start</button>
    </>
  );
};
