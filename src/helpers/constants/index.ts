import { TAGS } from '../../types';

export const MAIN_DIV_ID = 'root-div';
export const EDITOR_ID = 'editor';
export const TEXT_KEY = '#text';
export const TEXT_TAG = 'text';
export const mapForAddedNodes = new Map<string, string>([
    [TAGS.BLOCK, TAGS.PARAGRAPH],
    [TAGS.PARAGRAPH, TAGS.TEXT],
]);
