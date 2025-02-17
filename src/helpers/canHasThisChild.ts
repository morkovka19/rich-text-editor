import { TAGS, mapForAddedNodes } from './constants';

export const canHasThisChild = (parentTag: string, childTag: string) =>
    mapForAddedNodes.get(parentTag) === childTag || parentTag === TAGS.BLOCK;
