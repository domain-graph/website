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
  x: number;
  y: number;
}

const defaultValues: Context = {
  svg: null,
  width: 300,
  height: 150,
  zoom: 1,
  x: 0,
  y: 0,
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
  const [x, setX] = useState<number>(defaultValues.x);
  const [y, setY] = useState<number>(defaultValues.y);

  const observer = useRef(
    new ResizeObserver(([entry]) => {
      console.log({ entry });
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);
    }),
  );

  const viewBox = useMemo(() => {
    return `${-(width / 2 - x)} ${-(height / 2 - y)} ${width} ${height}`;
  }, [width, height, x, y]);

  useEffect(() => {
    observer.current.observe(wrapperRef.current);
    return () => {
      observer.current.disconnect();
    };
  });

  const value: Context = useMemo(
    () => ({ svg: canvas, width, height, zoom, x, y }),
    [canvas, width, height, zoom, x, y],
  );

  return (
    <context.Provider value={value}>
      <div
        ref={wrapperRef}
        className={`c-svg-canvas ${className}`}
        style={style}
      >
        <svg ref={onCanvasSet} width={width} height={height} viewBox={viewBox}>
          {children}
        </svg>
      </div>
    </context.Provider>
  );
};
