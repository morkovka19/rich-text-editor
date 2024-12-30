import BackgroundColor from '../../../icons/topbar-font-color/backgroundColor.svg';
import Color from '../../../icons/topbar-font-color/color.svg';
import Bold from '../../../icons/topbar-font-styles/bold.svg';
import CodeBlock from '../../../icons/topbar-font-styles/codeBlock.svg';
import Italic from '../../../icons/topbar-font-styles/italic.svg';
import Link from '../../../icons/topbar-font-styles/link.svg';
import Underline from '../../../icons/topbar-font-styles/underline.svg';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import ColorPicker from '../../controls/ColorPicker';

const FontStylesBlock = () => {
    return (
        <ButtonsContainer>
            <Button Icon={Bold} theme="icon" />
            <Button Icon={Italic} theme="icon" />
            <Button Icon={Underline} theme="icon" />
            <Button Icon={CodeBlock} theme="icon" />
            <Button Icon={Link} theme="icon" />
            <ColorPicker Icon={Color} color={''} />
            <ColorPicker Icon={BackgroundColor} color={''} />
        </ButtonsContainer>
    );
};

export default FontStylesBlock;
