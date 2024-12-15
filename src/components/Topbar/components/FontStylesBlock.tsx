import Bold from '../../../icons/topbar-font-styles/bold.svg';
import CodeBlock from '../../../icons/topbar-font-styles/codeBlock.svg';
import Italic from '../../../icons/topbar-font-styles/italic.svg';
import Link from '../../../icons/topbar-font-styles/link.svg';
import Underline from '../../../icons/topbar-font-styles/underline.svg';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';

const FontStylesBlock = () => {
    return (
        <ButtonsContainer>
            <Button Icon={Bold} theme="icon" />
            <Button Icon={Italic} theme="icon" />
            <Button Icon={Underline} theme="icon" />
            <Button Icon={CodeBlock} theme="icon" />
            <Button Icon={Link} theme="icon" />
        </ButtonsContainer>
    );
};

export default FontStylesBlock;
