/* eslint-disable @typescript-eslint/no-explicit-any */
export type TextTagType = 'text';

export type KlassConstructor<Cls extends GenericConstructor<any>> = GenericConstructor<InstanceType<Cls>> & {
    [k in keyof Cls]: Cls[k];
};
type GenericConstructor<T> = new (...args: any[]) => T;

export type SVGRIcon = React.FC<
    React.SVGProps<SVGSVGElement> & {
        /** Alternative text in title tag. */
        title?: string;
    }
>;
