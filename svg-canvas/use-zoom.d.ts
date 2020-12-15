export interface ZoomOptions {
    max?: number;
    min?: number;
    speed?: number;
}
export interface ZoomValues {
    delta: number;
    value: number;
    x: number;
    y: number;
}
export declare function useZoom(element: HTMLElement | SVGElement | null, onZoom: (values: ZoomValues) => void, options?: ZoomOptions): void;
