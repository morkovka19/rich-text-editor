import { TAGS } from '../types';
import { mapForAddedNodes } from './constants';

export const getAddedNodeType = (type: string) => mapForAddedNodes.get(type) || TAGS.TEXT;
