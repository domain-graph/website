import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface SvgCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

interface Context {
  svg: SVGSVGElement;
  width: number;
  height: number;
  zoom: number;
  // x: number;
  // y: number;
}

const defaultValues: Context = {
  svg: null,
  width: 300,
  height: 150,
  zoom: 1,
  // x: 0,
  // y: 0,
};

const context = createContext<Context>(defaultValues);

export function useSvgCanvas() {
  return useContext(context).svg;
}

export const SvgCanvas: React.FC<SvgCanvasProps> = ({
  className,
  style,
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement>();

  const [canvas, setCanvas] = useState<SVGSVGElement>(null);
  const onCanvasSet = useCallback((el: SVGSVGElement) => setCanvas(el), []);

  const [width, setWidth] = useState<number>(defaultValues.width);
  const [height, setHeight] = useState<number>(defaultValues.height);
  const [zoom, setZoom] = useState<number>(defaultValues.zoom);
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);

  const originRef = useRef<{ x: number; y: number }>({ x, y });
  const setOrigin = useCallback((xx: number, yy: number) => {
    // TODO: use requestAnimationFrame to update translate/scale directly
    setX(xx);
    setY(yy);
    originRef.current = { x: xx, y: yy };
  }, []);

  const scaleRef = useRef<number>(zoom);
  const setScale = useCallback((z: number) => {
    console.log({ z });
    scaleRef.current = z;
    setZoom(z);
  }, []);

  const observer = useRef(
    new ResizeObserver(([entry]) => {
      console.log({ entry });
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);
    }),
  );

  useEffect(() => {
    observer.current.observe(wrapperRef.current);
    return () => {
      observer.current.disconnect();
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragStart.current) {
        const dx = (e.offsetX - dragStart.current.x) / scaleRef.current;
        const dy = (e.offsetY - dragStart.current.y) / scaleRef.current;

        const originX = dragStart.current.originX - dx;
        const originY = dragStart.current.originY - dy;

        setOrigin(originX, originY);
      }
    },
    [setOrigin],
  );

  const dragStart = useRef<{
    x: number;
    y: number;
    originX: number;
    originY: number;
  }>(null);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      canvas.addEventListener('mousemove', handleMouseMove);
      dragStart.current = {
        x: e.offsetX,
        y: e.offsetY,
        originX: originRef.current.x,
        originY: originRef.current.y,
      };
    },
    [canvas],
  );

  const handleMouseUp = useCallback(() => {
    canvas.removeEventListener('mousemove', handleMouseMove);
    dragStart.current = null;
  }, [canvas]);

  useEffect(() => {
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
      };
    } else {
      return undefined;
    }
  }, [canvas]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      let z = scaleRef.current;

      z += e.deltaY * -0.005;

      // Restrict scale
      z = Math.min(Math.max(0.125, z), 4);

      setScale(z);
    },
    [canvas],
  );

  useEffect(() => {
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel);
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
      };
    } else {
      return undefined;
    }
  }, [canvas]);

  const value: Context = useMemo(() => ({ svg: canvas, width, height, zoom }), [
    canvas,
    width,
    height,
    zoom,
  ]);

  return (
    <context.Provider value={value}>
      <div
        ref={wrapperRef}
        className={`c-svg-canvas ${className}`}
        style={style}
      >
        <svg
          ref={onCanvasSet}
          width={width}
          height={height}
          viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
        >
          <g transform={`scale(${zoom})translate(${-x} ${-y})`}>{children}</g>
        </svg>
      </div>
    </context.Provider>
  );
};
