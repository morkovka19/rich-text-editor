import { TAGS, mapForAddedNodes } from './constants';

export const getAddedNodeType = (type: string) => mapForAddedNodes.get(type) || TAGS.TEXT;
