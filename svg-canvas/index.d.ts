import React from 'react';
export interface SvgCanvasProps {
    className?: string;
    style?: React.CSSProperties;
}
export declare const SvgCanvas: React.ForwardRefExoticComponent<SvgCanvasProps & {
    children?: React.ReactNode;
} & React.RefAttributes<SVGSVGElement>>;
