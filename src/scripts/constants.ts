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
