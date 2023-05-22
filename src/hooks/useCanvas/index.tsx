import "./index.css";
import { useRef } from "react";

interface Return {
  element: JSX.Element;
  ref: React.RefObject<HTMLCanvasElement>;
}

export const useCanvas = (): Return => {
  const ref = useRef<HTMLCanvasElement>(null)!;
  const element = <canvas ref={ref}></canvas>;

  return { element, ref };
};
