/* eslint-disable @typescript-eslint/no-explicit-any */
export const enum TAGS {
    PARAGRAPH = 'p',
    BLOCK = 'div',
    TEXT = '#text',
}

export type ParentTagType = TAGS.BLOCK;
export type TextTagType = 'text';

export type KlassConstructor<Cls extends GenericConstructor<any>> = GenericConstructor<InstanceType<Cls>> & {
    [k in keyof Cls]: Cls[k];
};
type GenericConstructor<T> = new (...args: any[]) => T;
