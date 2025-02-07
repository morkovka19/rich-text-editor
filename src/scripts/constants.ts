import { IOption } from '../components/controls/Select/Select.types';
import HorRuleIcon from '../icons/topbar-insert/horRule.svg';
import ImageIcon from '../icons/topbar-insert/image.svg';
import TableIcon from '../icons/topbar-insert/table.svg';
import CenterIcon from '../icons/topbar-text-block-style/center.svg';
import JustifyIcon from '../icons/topbar-text-block-style/justify.svg';
import LeftIcon from '../icons/topbar-text-block-style/left.svg';
import RightIcon from '../icons/topbar-text-block-style/right.svg';
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
        Icon: HorRuleIcon,
    },
    {
        label: 'Image',
        value: 'img',
        Icon: ImageIcon,
    },
    {
        label: 'Table',
        value: 'table',
        Icon: TableIcon,
    },
];

export const textBlockOptions: IOption[] = [
    {
        label: 'Left Align',
        value: 'left',
        Icon: LeftIcon,
    },
    {
        label: 'Center Align',
        value: 'right',
        Icon: CenterIcon,
    },
    {
        label: 'Right Align',
        value: 'center',
        Icon: RightIcon,
    },
    {
        label: 'Justify Align',
        value: 'justify',
        Icon: JustifyIcon,
    },
];

export const fontSelectOptions: IOption[] = [
    {
        label: 'Roboto',
        value: 'Roboto',
    },
    {
        label: 'Open Sans',
        value: 'Open Sans',
    },
    {
        label: 'Lato',
        value: 'Lato',
    },
    {
        label: 'Montserrat',
        value: 'Montserrat',
    },
    {
        label: 'Source Sans Pro',
        value: 'Source Sans Pro',
    },
    {
        label: 'Raleway',
        value: 'Raleway',
    },
    {
        label: 'Nunito',
        value: 'Nunito',
    },
    {
        label: 'Poppins',
        value: 'Poppins',
    },
    {
        label: 'Merriweather',
        value: 'Merriweather',
    },
    {
        label: 'Playfair Display',
        value: 'Playfair Display',
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
