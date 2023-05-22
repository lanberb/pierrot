import "./index.css";
import { FC, useRef, memo, useEffect } from "react";

const PADDING = 4;

interface Props {
  items: readonly {
    name: string;
    value: string;
  }[];
  onChange: (value: any) => void;
}

export const ModeSelector: FC<Props> = memo(({ items, onChange }) => {
  const ref = useRef<HTMLDivElement>(null)!;
  const selectedIndex = useRef(0);

  const resizeObserver = new ResizeObserver((entries) => {
    if (!ref.current) {
      return;
    }
    const [backgroundEntry] = entries;
    ref.current.style.width = `${
      (backgroundEntry.contentRect.width - PADDING * 2) / items.length
    }px`;
    slideBackground(selectedIndex.current);
  });

  const slideBackground = (index: number) => {
    if (!ref.current) {
      return;
    }
    ref.current.style.translate = `${
      (((ref.current.parentElement?.clientWidth || 0) - PADDING) /
        items.length) *
      index
    }px`;
  };

  useEffect(() => {
    if (!ref.current?.parentElement) {
      return;
    }
    resizeObserver.observe(ref.current?.parentElement);
  });

  return (
    <form className="modeSelector">
      <div className="modeSelector__itemBackground" ref={ref}></div>
      {items.map((mode, index) => {
        const { name, value } = mode;
        return (
          <div className="modeSelector__item" key={value}>
            <input
              className="modeSelector__radio"
              defaultChecked={index === 0}
              id={`modeSelector__radio--${value}`}
              name="modeSelector__radio"
              onChange={(event: React.FormEvent<HTMLInputElement>) => {
                if (!ref.current) {
                  return;
                }
                onChange(event.currentTarget.value);
                slideBackground(index);
                selectedIndex.current = index;
              }}
              type="radio"
              value={value}
            />
            <label
              className="modeSelector__label"
              htmlFor={`modeSelector__radio--${value}`}
            >
              {name}
            </label>
          </div>
        );
      })}
    </form>
  );
});
