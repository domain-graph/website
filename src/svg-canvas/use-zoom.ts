import { useCallback, useEffect, useRef } from 'react';

export interface ZoomOptions {
  max?: number;
  min?: number;
  speed?: number;
  // onZoom: (values: ZoomValues) => void;
}

export interface ZoomValues {
  delta: number;
  value: number;
  x: number;
  y: number;
}

interface State {
  element: HTMLElement | SVGElement;
  max: number;
  min: number;
  speed: number;
  value: number;
  onZoom: (values: ZoomValues) => void;
}

export function useZoom(
  element: HTMLElement | SVGElement,
  onZoom: (values: ZoomValues) => void,
  options?: ZoomOptions,
) {
  const state = useRef<State>({
    element,
    max: typeof options?.max === 'number' ? options?.max : 4,
    min: typeof options?.min === 'number' ? options?.max : 0.125,
    speed: typeof options?.speed === 'number' ? options?.max : 0.005,
    value: 1,
    onZoom,
  });

  const { min, max, speed } = options || {};

  useEffect(() => {
    state.current.max = typeof max === 'number' ? max : 4;
    state.current.min = typeof min === 'number' ? min : 0.125;
    state.current.speed = typeof min === 'number' ? speed : 0.005;
    state.current.onZoom = onZoom;

    // TODO check that current value is not out of bounds
  }, [min, max, speed, onZoom]);

  const handleWheel = useRef((e: WheelEvent) => {
    e.preventDefault();
    const { value } = state.current;

    let newValue = value + e.deltaY * -0.005;

    // Restrict scale
    newValue = Math.min(
      Math.max(state.current.min, newValue),
      state.current.max,
    );

    const delta = newValue - state.current.value;

    state.current.value = newValue;

    if (delta) {
      state.current.onZoom({
        delta,
        value: newValue,
        x: e.offsetX,
        y: e.offsetY,
      });
    }
  });

  useEffect(() => {
    state.current.element = element;
    if (element) {
      const onWheel = handleWheel.current;
      element.addEventListener('wheel', onWheel);
      return () => {
        element.removeEventListener('wheel', onWheel);
      };
    } else {
      return undefined;
    }
  }, [element]);
}
