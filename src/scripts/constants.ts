import { IOption } from '../components/controls/Select/Select.types';
import BulletListIcon from '../icons/topbar-type-text/bullet-list.svg';
import H1Icon from '../icons/topbar-type-text/h1.svg';
import H2Icon from '../icons/topbar-type-text/h2.svg';
import H3Icon from '../icons/topbar-type-text/h3.svg';
import NoramlIcon from '../icons/topbar-type-text/normal.svg';
import NumberListIcon from '../icons/topbar-type-text/number-list.svg';

export const typeSelectOptions: IOption[] = [
    {
        label: 'Normal',
        value: 'p',
        Icon: NoramlIcon,
    },
    {
        label: 'Heading 1',
        value: 'h1',
        Icon: H1Icon,
    },
    {
        label: 'Heading 2',
        value: 'h2',
        Icon: H2Icon,
    },
    {
        label: 'Heading 3',
        value: 'h3',
        Icon: H3Icon,
    },
    {
        label: 'Bullet list',
        value: 'ul',
        Icon: BulletListIcon,
    },
    {
        label: 'Number List',
        value: 'ol',
        Icon: NumberListIcon,
    },
];

export const insertOptions: IOption[] = [
    {
        label: 'Horizontal Rule',
        value: 'hr',
        Icon: NoramlIcon,
    },
    {
        label: 'Image',
        value: 'img',
        Icon: H2Icon,
    },
    {
        label: 'Table',
        value: 'table',
        Icon: H3Icon,
    },
];

export const fontSelectOptions: IOption[] = [
    {
        label: 'Arial',
        value: 'Arial',
    },
    {
        label: 'Courier New',
        value: 'Courier New',
    },
    {
        label: 'Georgia',
        value: 'Georgia',
    },
    {
        label: 'Times New Roman',
        value: 'Times New Roman',
    },
    {
        label: 'Trebuchet MS',
        value: 'Trebuchet MS',
    },
    {
        label: 'Verdana',
        value: 'Verdana',
    },
];

export const baseColors = [
    'rgb(208, 2, 27)',
    'rgb(245, 166, 35)',
    'rgb(248, 231, 28)',
    'rgb(139, 87, 42)',
    'rgb(126, 211, 33)',
    'rgb(65, 117, 5)',
    'rgb(189, 16, 224)',
    'rgb(184, 233, 134)',
    'rgb(0, 0, 0)',
    'rgb(74, 74, 74)',
    'rgb(155, 155, 155)',
    'rgb(255, 255, 255)',
];
