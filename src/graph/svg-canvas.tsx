import React, { useCallback, useRef, useState, forwardRef } from 'react';

import { useDrag } from './use-drag';
import { useResize } from './use-resize';
import { useZoom } from './use-zoom';

export interface SvgCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

interface State {
  wrapper: HTMLDivElement;
  canvas: SVGSVGElement;
  transformGroup: SVGGElement;
  postX: number;
  postY: number;
  preX: number;
  preY: number;
  scale: number;
  width: number;
  height: number;
}

export const SvgCanvas = forwardRef<
  SVGSVGElement,
  React.PropsWithChildren<SvgCanvasProps>
>(({ className, style, children }, forwardedRef) => {
  const state = useRef<State>({
    wrapper: null,
    canvas: null,
    transformGroup: null,
    postX: 0,
    postY: 0,
    preX: 0,
    preY: 0,
    scale: 1,
    width: 300,
    height: 150,
  });

  const [wrapper, setWrapper] = useState<HTMLDivElement>(null);
  const wrapperRef = useCallback(
    (element: HTMLDivElement) => {
      setWrapper(element);
      const ref = forwardedRef as any;
      if (ref) {
        if (typeof ref === 'function') {
          ref(element);
        } else {
          ref.current = element;
        }
      }
      state.current.wrapper = element;
    },
    [forwardedRef],
  );

  const [canvas, setCanvas] = useState<SVGSVGElement>(null);
  const canvasRef = useCallback((element: SVGSVGElement) => {
    setCanvas(element);
    state.current.canvas = element;
  }, []);

  const transformGroupRef = useCallback((element: SVGGElement) => {
    state.current.transformGroup = element;
  }, []);

  const updateFn = useRef(() => {
    requestAnimationFrame(() => {
      const { width, height, postX, postY, preX, preY, scale } = state.current;

      state.current.canvas.setAttribute('viewBox', `0 0 ${width} ${height}`);
      state.current.canvas.setAttribute('width', `${width}px`);
      state.current.canvas.setAttribute('height', `${height}px`);

      const center = `translate(${width / 2} ${height / 2})`;
      const pre = `translate(${preX} ${preY})`;
      const zoom = `scale(${scale})`;
      const post = `translate(${-postX} ${-postY})`;

      state.current.transformGroup.setAttribute(
        'transform',
        center + pre + zoom + post,
      );
    });
  });

  useDrag(canvas, {
    onMove: ({ dx, dy }) => {
      state.current.preX += dx;
      state.current.preY += dy;

      updateFn.current();
    },
  });

  useZoom(canvas, ({ value, x, y }) => {
    const centerX = state.current.width / 2;
    const centerY = state.current.height / 2;

    const newPreX = x - centerX;
    const newPreY = y - centerY;

    const dx = newPreX - state.current.preX;
    const dy = newPreY - state.current.preY;

    state.current.preX = newPreX;
    state.current.preY = newPreY;

    state.current.postX += dx / state.current.scale;
    state.current.postY += dy / state.current.scale;

    state.current.scale = value;

    updateFn.current();
  });

  useResize(wrapper, ({ width, height }) => {
    state.current.width = width;
    state.current.height = height;

    updateFn.current();
  });

  return (
    <div
      ref={wrapperRef}
      className={`c-svg-canvas${className ? ' ' + className : ''}`}
      style={style}
    >
      <svg ref={canvasRef}>
        <g ref={transformGroupRef}>{children}</g>
      </svg>
    </div>
  );
});

SvgCanvas.displayName = 'SvgCanvas';
