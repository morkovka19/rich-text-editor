import BulletListIcon from '../../../icons/toolbar/bullet-list.svg';
import H1Icon from '../../../icons/toolbar/h1.svg';
import H2Icon from '../../../icons/toolbar/h2.svg';
import H3Icon from '../../../icons/toolbar/h3.svg';
import NormalIcon from '../../../icons/toolbar/normal.svg';
import NumberListIcon from '../../../icons/toolbar/number-list.svg';
import { IOption } from '../../controls/Select/types';

export enum TypeOptionsLabels {
    NORMAL = 'Normal',
    H1 = 'Heading 1',
    H2 = 'Heading 2',
    H3 = 'Heading 3',
    BULLET_LIST = 'Bullet list',
    NUMBERED_LIST = 'Numbered list',
}

export enum TypeOptionsValues {
    NORMAL = 'p',
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    BULLET_LIST = 'ul',
    NUMBERED_LIST = 'ol',
}

export enum TypeOptionsIcons {
    NORMAL = NormalIcon,
    H1 = H1Icon,
    H2 = H2Icon,
    H3 = H3Icon,
    BULLET_LIST = BulletListIcon,
    NUMBERED_LIST = NumberListIcon,
}

export const typeOptins: IOption[] = [
    {
        value: TypeOptionsValues.NORMAL,
        label: TypeOptionsLabels.NORMAL,
        Icon: NormalIcon,
    },
    {
        value: TypeOptionsValues.H1,
        label: TypeOptionsLabels.H1,
        Icon: H1Icon,
    },
    {
        value: TypeOptionsValues.H2,
        label: TypeOptionsLabels.H2,
        Icon: H2Icon,
    },
    {
        value: TypeOptionsValues.H3,
        label: TypeOptionsLabels.H3,
        Icon: H3Icon,
    },
    {
        value: TypeOptionsValues.BULLET_LIST,
        label: TypeOptionsLabels.BULLET_LIST,
        Icon: BulletListIcon,
    },
    {
        value: TypeOptionsValues.NUMBERED_LIST,
        label: TypeOptionsLabels.NUMBERED_LIST,
        Icon: NumberListIcon,
    },
];

export enum FontOptionsValuesLabels {
    ARIAL = 'Arial',
    COURIER_NEW = 'Courier New',
    GEORGIA = 'Georgia',
    TIMES_NEW_ROMAN = 'Times New Roman',
    TREBUCHET_MS = 'Trebuchet MS',
    VERDANA = 'Verdana',
}

export const fontOptions = [
    {
        value: FontOptionsValuesLabels.ARIAL,
        label: FontOptionsValuesLabels.ARIAL,
    },
    {
        value: FontOptionsValuesLabels.COURIER_NEW,
        label: FontOptionsValuesLabels.COURIER_NEW,
    },
    {
        value: FontOptionsValuesLabels.GEORGIA,
        label: FontOptionsValuesLabels.GEORGIA,
    },
    {
        value: FontOptionsValuesLabels.TIMES_NEW_ROMAN,
        label: FontOptionsValuesLabels.TIMES_NEW_ROMAN,
    },
    {
        value: FontOptionsValuesLabels.TREBUCHET_MS,
        label: FontOptionsValuesLabels.TREBUCHET_MS,
    },
    {
        value: FontOptionsValuesLabels.VERDANA,
        label: FontOptionsValuesLabels.VERDANA,
    },
];
