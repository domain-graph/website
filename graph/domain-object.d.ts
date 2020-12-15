import './domain-object.less';
import React from 'react';
import { Node } from './types';
export interface DomainObjectProps {
    node: Node;
    isSelected: boolean;
    onPin: (id: string) => void;
    onUnpin: (id: string) => void;
    onHide: (id: string) => void;
    onExpand: (id: string) => void;
    onSelect: (id: string) => void;
}
export declare const DomainObject: React.FC<DomainObjectProps>;
