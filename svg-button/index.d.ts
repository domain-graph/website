import './index.less';
import React from 'react';
export interface ButtonProps {
    cx?: React.ReactText;
    cy?: React.ReactText;
    r: React.ReactText;
    onClick?(event: React.MouseEvent<SVGCircleElement, MouseEvent>): void;
    className?: string;
}
export declare const CircleButton: React.FC<ButtonProps>;
export declare const RectButton: React.FC<React.SVGProps<SVGRectElement>>;
