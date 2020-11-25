import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface SvgCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

interface State {
  wrapper: HTMLDivElement;
  canvas: SVGSVGElement;
  transformGroup: SVGGElement;
  observer: ResizeObserver;
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

const context = createContext<SVGSVGElement>(null);

export function useSvgCanvas() {
  return useContext(context);
}

export const SvgCanvas: React.FC<SvgCanvasProps> = ({
  className,
  style,
  children,
}) => {
  const state = useRef<State>({
    wrapper: null,
    canvas: null,
    transformGroup: null,
    observer: null,
    x: 0,
    y: 0,
    scale: 1,
    width: 300,
    height: 150,
  });

  const wrapperRef = useCallback((element: HTMLDivElement) => {
    state.current.wrapper = element;
  }, []);

  const [canvas, setCanvas] = useState<SVGSVGElement>(null);

  const canvasRef = useCallback((element: SVGSVGElement) => {
    setCanvas(element);
    state.current.canvas = element;
  }, []);

  const transformGroupRef = useCallback((element: SVGGElement) => {
    state.current.transformGroup = element;
  }, []);

  const updateViewBox = useCallback(() => {
    requestAnimationFrame(() => {
      console.log('updateViewBox', state.current.width, state.current.height);
      state.current.canvas.setAttribute(
        'viewBox',
        `${-state.current.width / 2} ${-state.current.height / 2} ${
          state.current.width
        } ${state.current.height}`,
      );
      state.current.canvas.setAttribute('width', `${state.current.width}px`);
      state.current.canvas.setAttribute('height', `${state.current.height}px`);
    });
  }, []);

  const updateTransform = useCallback(() => {
    requestAnimationFrame(() => {
      state.current.transformGroup.setAttribute(
        'transform',
        `scale(${state.current.scale})translate(${-state.current.x} ${-state
          .current.y})`,
      );
    });
  }, []);

  const dragStart = useRef<{
    x: number;
    y: number;
    originX: number;
    originY: number;
  }>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragStart.current) {
      const dx = (e.offsetX - dragStart.current.x) / state.current.scale;
      const dy = (e.offsetY - dragStart.current.y) / state.current.scale;

      state.current.x = dragStart.current.originX - dx;
      state.current.y = dragStart.current.originY - dy;

      updateTransform();
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    state.current.canvas.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    dragStart.current = null;
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    state.current.canvas.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    dragStart.current = {
      x: e.offsetX,
      y: e.offsetY,
      originX: state.current.x,
      originY: state.current.y,
    };
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    let z = state.current.scale;

    z += e.deltaY * -0.005;

    // Restrict scale
    z = Math.min(Math.max(0.125, z), 4);

    state.current.scale = z;

    updateTransform();
  }, []);

  useEffect(() => {
    if (canvas) {
      state.current.observer ||= new ResizeObserver(([entry]) => {
        state.current.width = entry.target.clientWidth;
        state.current.height = entry.target.clientHeight;
        updateViewBox();
      });

      state.current.width = canvas.clientWidth;
      state.current.height = canvas.clientHeight;

      updateViewBox();
      updateTransform();

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('wheel', handleWheel);
      state.current.observer.observe(state.current.wrapper);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('wheel', handleWheel);
        state.current.observer.unobserve(state.current.wrapper);
      };
    } else {
      return undefined;
    }
  }, [canvas]);

  return (
    <context.Provider value={canvas}>
      <div
        ref={wrapperRef}
        className={`c-svg-canvas${className ? ' ' + className : ''}`}
        style={style}
      >
        <svg ref={canvasRef}>
          <g ref={transformGroupRef}>{children}</g>
        </svg>
      </div>
    </context.Provider>
  );
};
