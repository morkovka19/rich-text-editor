import { mapForAddedNodes } from './constants';

export const getAddedNodeType = (type: string) => mapForAddedNodes.get(type) || 'p';
