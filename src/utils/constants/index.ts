import { IOption } from '../../components/controls/Select/types';
import HorRuleIcon from '../../icons/topbar-insert/horRule.svg';
import ImageIcon from '../../icons/topbar-insert/image.svg';
import TableIcon from '../../icons/topbar-insert/table.svg';
import CenterIcon from '../../icons/topbar-text-block-style/center.svg';
import JustifyIcon from '../../icons/topbar-text-block-style/justify.svg';
import LeftIcon from '../../icons/topbar-text-block-style/left.svg';
import RightIcon from '../../icons/topbar-text-block-style/right.svg';
import BulletListIcon from '../../icons/topbar-type-text/bullet-list.svg';
import H1Icon from '../../icons/topbar-type-text/h1.svg';
import H2Icon from '../../icons/topbar-type-text/h2.svg';
import H3Icon from '../../icons/topbar-type-text/h3.svg';
import NoramlIcon from '../../icons/topbar-type-text/normal.svg';
import NumberListIcon from '../../icons/topbar-type-text/number-list.svg';

export const TAGS = {
    NORMAL: 'p',
    BLOCK: 'div',
    TEXT: 'span',
    H1: 'h1',
    H2: 'h2',
    H3: 'h3',
    OL: 'ol',
    UL: 'ul',
    LI: 'li',
    LINK: 'a',
};

export const MAIN_DIV_ID = 'root-div';
export const EDITOR_ID = 'editor';
export const TEXT_TAG = 'text';

export const mapForAddedNodes = new Map<string, string>([
    [TAGS.BLOCK, TAGS.NORMAL],
    [TAGS.NORMAL, TAGS.TEXT],
    [TAGS.H1, TAGS.TEXT],
    [TAGS.H2, TAGS.TEXT],
    [TAGS.H3, TAGS.TEXT],
    [TAGS.OL, TAGS.LI],
    [TAGS.UL, TAGS.LI],
    [TAGS.LI, TAGS.TEXT],
    [TAGS.LINK, TAGS.TEXT],
]);

export const inlineTags = ['span', 'a'];

export const HISTORY_TIMEOUT = 3000;
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
        value: 'center',
        Icon: CenterIcon,
    },
    {
        label: 'Right Align',
        value: 'right',
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

export const LINK_START = 'https://';
export const EMPTY_FOR_SELECT = '\u200B';
