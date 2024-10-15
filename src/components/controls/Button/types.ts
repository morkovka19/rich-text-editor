/* eslint-disable @typescript-eslint/no-explicit-any */
export type SVGRIcon = React.FC<
    React.SVGProps<SVGSVGElement> & {
        /** Alternative text in title tag. */
        title?: string;
    }
>;

export interface ButtonProps {
    iconStyle?: string;
    label?: string;
    Icon?: SVGRIcon;
    onClick: () => void;
    isRound?: boolean;
    isSelect?: boolean;
    isSelectOpen?: boolean;
    isSelectOption?: boolean;
}
