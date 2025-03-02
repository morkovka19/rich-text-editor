import { useCallback } from 'react';

import { useTooltip } from '../../../context/ToolbarContext';
import BackgroundColor from '../../../icons/topbar-font-color/backgroundColor.svg';
import Color from '../../../icons/topbar-font-color/color.svg';
import Bold from '../../../icons/topbar-font-styles/bold.svg';
import CodeBlock from '../../../icons/topbar-font-styles/codeBlock.svg';
import Italic from '../../../icons/topbar-font-styles/italic.svg';
// import Link from '../../../icons/topbar-font-styles/link.svg';
import Underline from '../../../icons/topbar-font-styles/underline.svg';
import { StylePropsConst } from '../../../utils/styleUtils';
// import { ActionWithTag, TAGS } from '../../../utils/constants';
// import LinkEditor from '../../LinkEditor';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import ColorPicker from '../../controls/ColorPicker';

const FontStylesBlock = () => {
    // const [isOpenLink, setIsOpenLink] = useState(false);
    const { style, togetherSetStyle, updateActualStyle } = useTooltip();

    const handleUpdateColor = useCallback(
        (value: string) => {
            const newStyleProp = { [StylePropsConst.COLOR]: value };
            updateActualStyle(newStyleProp);
            togetherSetStyle(newStyleProp);
        },
        [togetherSetStyle, updateActualStyle]
    );

    const handleUpdateBackground = useCallback(
        (value: string) => {
            const newStyleProp = { [StylePropsConst.BACKGROUND_COLOR]: value };
            updateActualStyle(newStyleProp);
            togetherSetStyle(newStyleProp);
        },
        [togetherSetStyle, updateActualStyle]
    );

    const handleUpdateFontWeight = useCallback(() => {
        const value = style.fontWeight === '400' ? '700' : '400';
        const newStyleProp = { [StylePropsConst.FONT_WEIGHT]: value };
        updateActualStyle(newStyleProp);
        togetherSetStyle(newStyleProp);
    }, [style.fontWeight, togetherSetStyle, updateActualStyle]);

    const handleUpdateFontStyle = useCallback(() => {
        const value = style.fontStyle === 'normal' ? 'italic' : 'normal';
        const newStyleProp = { [StylePropsConst.FONT_STYLE]: value };
        updateActualStyle(newStyleProp);
        togetherSetStyle(newStyleProp);
    }, [style.fontStyle, togetherSetStyle, updateActualStyle]);

    const handleUpdateTextDecoration = useCallback(() => {
        const value = style.textDecoration === 'normal' ? 'underline' : 'normal';

        const newStyleProp = { [StylePropsConst.TEXT_DECORATION]: value };
        updateActualStyle(newStyleProp);
        togetherSetStyle(newStyleProp);
    }, [style.textDecoration, togetherSetStyle, updateActualStyle]);

    // const handleEditLink = useCallback(
    //     (action: ActionWithTag, key: NodeKeyType, href?: string) => {
    //         editLinkTag(action, key, href);
    //     },
    //     [editLinkTag]
    // );

    return (
        <ButtonsContainer>
            <Button
                Icon={Bold}
                theme="icon"
                onClick={handleUpdateFontWeight}
                isActive={Number(style[StylePropsConst.FONT_WEIGHT]) === 700}
            />
            <Button
                Icon={Italic}
                theme="icon"
                onClick={handleUpdateFontStyle}
                isActive={style[StylePropsConst.FONT_STYLE] === 'italic'}
            />
            <Button
                Icon={Underline}
                theme="icon"
                onClick={handleUpdateTextDecoration}
                isActive={style[StylePropsConst.TEXT_DECORATION] === 'underline'}
            />
            <Button Icon={CodeBlock} theme="icon" />
            {/* <Button Icon={Link} theme="icon" onClick={() => setIsOpenLink(prev => !prev)} /> */}
            {/* {isOpenLink && (
                <LinkEditor
                    onClose={() => setIsOpenLink(false)}
                    activeNode={focuseNode as HTMLElement}
                    value={focuseNode?.nodeName === TAGS.LINK ? focuseNode?.textContent || '' : ''}
                    onChange={handleEditLink}
                />
            )} */}
            <ColorPicker Icon={Color} color={style[StylePropsConst.COLOR]} handleUpdate={handleUpdateColor} />
            <ColorPicker
                Icon={BackgroundColor}
                color={style[StylePropsConst.BACKGROUND_COLOR]}
                handleUpdate={handleUpdateBackground}
            />
        </ButtonsContainer>
    );
};

export default FontStylesBlock;
