import { ParentTagType, TAGS } from '../types';

export const isParentTagType = (type: string): type is ParentTagType => type === TAGS.BLOCK;
