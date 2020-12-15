import './base.less';
import React, { ReactNode } from 'react';
export interface IconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
    x?: React.ReactText;
    y?: React.ReactText;
}
export interface IconFactory {
    (displayName: string, children: ReactNode): React.FC<IconProps>;
}
export declare const icon: IconFactory;
