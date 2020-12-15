export interface DragOptions {
    onMove?: (values: MoveValues) => void;
    onBegin?: (values: BeginValues) => void;
    onEnd?: (values: EndValues) => void;
}
export interface MoveValues {
    beginX: number;
    beginY: number;
    currentX: number;
    currentY: number;
    dx: number;
    dy: number;
}
export interface BeginValues {
    beginX: number;
    beginY: number;
}
export interface EndValues {
    beginX: number;
    beginY: number;
    endX: number;
    endY: number;
}
export declare function useDrag(element: HTMLElement | SVGElement | null, options?: DragOptions): void;
