import { TAGS } from '../types';

export const isParentTagType = (type: string) => type !== TAGS.TEXT;
export const isBlockParenTagType = (type: string) => type === TAGS.BLOCK;
