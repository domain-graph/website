import './node-picker.less';
import React from 'react';
import { Node } from './types';
export interface NodePickerProps {
    nodes: Node[];
    onShow: (nodeId: string) => void;
    onHide: (nodeId: string) => void;
    onHideAll: () => void;
    onHideUnpinned: () => void;
}
export declare const NodePicker: React.FC<NodePickerProps>;
