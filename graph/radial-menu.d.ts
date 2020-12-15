import React from 'react';
export interface RadialMenuProps {
    isVisible: boolean | null;
    radius: number;
    spread: number;
    margin: number;
}
export declare const RadialMenu: React.FC<RadialMenuProps>;
