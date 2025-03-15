import { FC, useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { NodeKey } from '../../classes/LexicalNode/types';
import { useHistory } from '../../context/HistoryContext';
import { useEditor } from '../../context/LexicalContext';
import { useTooltip } from '../../context/ToolbarContext';
import BackgroundColor from '../../icons/topbar/backgroundColor.svg';
import Bold from '../../icons/topbar/bold.svg';
import CodeBlock from '../../icons/topbar/codeBlock.svg';
import Color from '../../icons/topbar/color.svg';
import Italic from '../../icons/topbar/italic.svg';
import Link from '../../icons/topbar/link.svg';
import Plus from '../../icons/topbar/plus.svg';
import Redo from '../../icons/topbar/redo.svg';
import FontIcon from '../../icons/topbar/topbar-font.svg';
import Underline from '../../icons/topbar/underline.svg';
import Undo from '../../icons/topbar/undo.svg';
import { TAGS, fontSelectOptions, insertOptions, textBlockOptions, typeSelectOptions } from '../../utils/constants';
import { StylePropsConst } from '../../utils/styleUtils';
import LinkEditor from '../LinkEditor';
import Button from '../controls/Button';
import { ButtonsContainer } from '../controls/ButtonsContainer';
import ColorPicker from '../controls/ColorPicker';
import Counter from '../controls/Counter';
import Select from '../controls/Select';
import { Divider } from './components/Divider';
import './styles.scss';
import { TopbarProps } from './types';

const Topbar: FC<TopbarProps> = () => {
    const { canRedo, canUndo, undo, redo } = useHistory();
    const { style, actualStyleRef, handleUpdateActualStyle, tag, focusNodeRef, styleParent } = useTooltip();
    const { editor } = useEditor();

    const [isOpenLinkEditor, setIsOpenLinkEditor] = useState(false);

    const contextMenuObserver = useMemo(
        () => ({
            handleClickContextMenu: (e: Event) => {
                const focusNode = e.target as HTMLElement;
                if (focusNode.parentElement?.localName === TAGS.LINK) {
                    e.preventDefault();
                    setIsOpenLinkEditor(true);
                }
            },
        }),
        []
    );

    useLayoutEffect(
        () => editor.registerObserver('handleClickContextMenu', contextMenuObserver),
        [contextMenuObserver, editor]
    );

    const handleUpdateTag = useCallback(
        (value: string) => {
            editor.triggerTagUpdate(value);
        },
        [editor]
    );

    const handleUpdateFont = useCallback(
        (value: string) => {
            const newStyleProp = { [StylePropsConst.FONT_FAMILY]: value };
            handleUpdateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
        },
        [actualStyleRef, editor, handleUpdateActualStyle]
    );

    const handleUpdateSize = useCallback(
        (value: number) => {
            const newStyleProp = { [StylePropsConst.FONT_SIZE]: `${value}px` };
            handleUpdateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
        },
        [actualStyleRef, editor, handleUpdateActualStyle]
    );

    const handleUpdateColor = useCallback(
        (value: string) => {
            const newStyleProp = { [StylePropsConst.COLOR]: value };
            handleUpdateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({
                ...actualStyleRef.current,
                ...newStyleProp,
            });
        },
        [actualStyleRef, editor, handleUpdateActualStyle]
    );

    const handleUpdateBackground = useCallback(
        (value: string) => {
            const newStyleProp = { [StylePropsConst.BACKGROUND_COLOR]: value };
            handleUpdateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({
                ...actualStyleRef.current,
                ...newStyleProp,
            });
        },

        [actualStyleRef, editor, handleUpdateActualStyle]
    );

    const handleUpdateFontWeight = useCallback(() => {
        const value = style.fontWeight === '400' ? '700' : '400';
        const newStyleProp = { [StylePropsConst.FONT_WEIGHT]: value };
        handleUpdateActualStyle(newStyleProp);
        editor.triggerDecoratedUpdate({
            ...actualStyleRef.current,
            ...newStyleProp,
        });
    }, [style.fontWeight, handleUpdateActualStyle, editor, actualStyleRef]);

    const handleUpdateFontStyle = useCallback(() => {
        const value = style.fontStyle === 'normal' ? 'italic' : 'normal';
        const newStyleProp = { [StylePropsConst.FONT_STYLE]: value };
        handleUpdateActualStyle(newStyleProp);
        editor.triggerDecoratedUpdate({
            ...actualStyleRef.current,
            ...newStyleProp,
        });
    }, [style.fontStyle, handleUpdateActualStyle, editor, actualStyleRef]);

    const handleUpdateTextDecoration = useCallback(() => {
        const value = style.textDecoration === 'normal' ? 'underline' : 'normal';
        const newStyleProp = { [StylePropsConst.TEXT_DECORATION]: value };
        handleUpdateActualStyle(newStyleProp);
        editor.triggerDecoratedUpdate({
            ...actualStyleRef.current,
            ...newStyleProp,
        });
    }, [style.textDecoration, handleUpdateActualStyle, editor, actualStyleRef]);

    const handleEditLink = useCallback(
        (key: NodeKey, href?: string) => {
            editor.triggerLinkEditor(key, href);
        },
        [editor]
    );

    const handleUpdateParentStyle = useCallback(
        (value: string) => {
            editor.triggerDecorateParent({ [StylePropsConst.TEXT_ALIGN]: value });
        },
        [editor]
    );

    const colorBg = useMemo(() => style[StylePropsConst.BACKGROUND_COLOR], [style]);
    const color = useMemo(() => style[StylePropsConst.COLOR], [style]);
    const activeTag = useMemo(
        () => typeSelectOptions.find(op => op.value === tag) || typeSelectOptions.find(op => op.value === TAGS.NORMAL),
        [tag]
    );
    const fontFamily = useMemo(() => style.fontFamily, [style.fontFamily]);
    const activeOption = useMemo(() => fontSelectOptions.find(val => val.value === fontFamily), [fontFamily]);
    const activeSize = useMemo(() => {
        const styleSize = style[StylePropsConst.FONT_SIZE];
        return Number(styleSize.replace('px', ''));
    }, [style]);

    const textStyleValue = useMemo(
        () => textBlockOptions.find(op => op.value === styleParent[StylePropsConst.TEXT_ALIGN]) || textBlockOptions[0],
        [styleParent]
    );

    return (
        <div className="topbar" onClick={e => e.preventDefault()}>
            <ButtonsContainer>
                <Button theme="icon" Icon={Undo} onClick={undo} disabled={!canUndo} title="Назад" />
                <Button theme="icon" Icon={Redo} onClick={redo} disabled={!canRedo} title="Вперед" />
                <Divider />
                <Select options={typeSelectOptions} onChange={handleUpdateTag} value={activeTag} />
                <Divider />
                <Select options={fontSelectOptions} Icon={FontIcon} onChange={handleUpdateFont} value={activeOption} />
                <Divider />
                <Counter handelUpdate={handleUpdateSize} value={activeSize} />
                <Divider />
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
                <Button Icon={Link} theme="icon" onClick={() => setIsOpenLinkEditor(prev => !prev)} />
                {isOpenLinkEditor && (
                    <LinkEditor
                        onClose={() => setIsOpenLinkEditor(false)}
                        activeNode={focusNodeRef.current as HTMLElement}
                        value={
                            focusNodeRef.current?.parentElement?.localName === TAGS.LINK
                                ? focusNodeRef.current?.parentElement?.getAttribute('href') || ''
                                : ''
                        }
                        onChange={handleEditLink}
                    />
                )}
                <ColorPicker Icon={Color} color={color} handleUpdate={handleUpdateColor} />
                <ColorPicker Icon={BackgroundColor} color={colorBg} handleUpdate={handleUpdateBackground} />
                <Divider />
                <Select options={insertOptions} Icon={Plus} isStaticName name="Insert" />
                <Divider />
                <Select options={textBlockOptions} value={textStyleValue} onChange={handleUpdateParentStyle} />
            </ButtonsContainer>
        </div>
    );
};

export { Topbar };
