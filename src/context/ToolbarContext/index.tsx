/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-refresh/only-export-components */
import {
    FC,
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { getStyleState, initialStyle, initialStyleParent } from '../../utils/styleUtils';
import { useEditor } from '../LexicalContext';

export type TooltipContextProps = {
    style: StyleProps;
    tag: string;
    updateStyle: (newStyleProp: StyleProps) => void;
    actualStyleRef: React.MutableRefObject<StyleProps>;
    updateActualStyle: (styleNew: StyleProps) => void;
    updateTag: (tag: string) => void;
    focusNodeRef: React.MutableRefObject<HTMLElement | null>;
    handleClick: (e: Event) => void;
    handleUpdateSelect: (selection: Selection) => void;
    handleInput: (focusNode: HTMLElement) => void;
    handleClickContextMenu: (e: Event) => void;
    handleDecorateParent: (newStyle: StyleProps) => void;
    styleParent: StyleProps;
};

export interface StyleProps {
    [key: string]: string;
}

type Props = PropsWithChildren<{
    etitable?: boolean;
    initialSettings: StyleProps;
}>;
const TooltipContext = createContext<TooltipContextProps | null>(null);

export const TooltipProvider: FC<Props> = ({ children }) => {
    const { editor } = useEditor();
    const [style, setStyle] = useState(initialStyle);
    const [styleParent, setStyleParent] = useState(initialStyle);
    const [tag, setTag] = useState('p');
    const focusElement: HTMLElement | null = null;
    const focusNodeRef = useRef<HTMLElement | null>(focusElement);
    const actualStyleRef = useRef<StyleProps>({});

    const updateActualStyle = useCallback((styleNew: StyleProps) => {
        Object.keys(styleNew).forEach(key => {
            if (styleNew[key] === style[key]) return;
            if (actualStyleRef.current[key]) {
                if (styleNew[key] !== actualStyleRef.current[key])
                    actualStyleRef.current = {
                        ...actualStyleRef.current,
                        [key]: styleNew[key],
                    };
            } else {
                actualStyleRef.current = {
                    ...actualStyleRef.current,
                    [key]: styleNew[key],
                };
            }
        });
    }, []);

    const handleClick = useCallback((e: Event) => {
        const focusNode =
            (e.target as HTMLElement).localName === 'span'
                ? (e.target as HTMLElement)
                : ((e.target as HTMLElement).lastElementChild as HTMLElement);
        focusNodeRef.current = focusElement;
        const style = focusNode.getAttribute('style') || '';
        const styleProps: StyleProps = getStyleState(style);
        actualStyleRef.current = styleProps;
        setStyle({ ...initialStyle, ...styleProps });
        const parentElement = focusNode.parentElement as HTMLElement;
        const parentTag = parentElement.localName;
        const styleParentActual = parentElement.getAttribute('style') || '';
        const styleParentActualProps = getStyleState(styleParentActual);
        setStyleParent({ ...initialStyleParent, ...styleParentActualProps });
        setTag(parentTag);
    }, []);

    const updateStyle = useCallback((newStyleProp: StyleProps) => {
        setStyle(prev => ({ ...prev, ...newStyleProp }));
    }, []);

    const updateTag = useCallback((tag: string) => {
        setTag(tag);
        setStyle(initialStyle);
    }, []);

    const handleUpdateSelect = useCallback((selection: Selection) => {
        const focusElement = selection.focusNode as HTMLElement;

        focusNodeRef.current =
            focusElement?.nodeType === 3 ? (focusElement?.parentElement as HTMLElement) : focusElement;
    }, []);

    const handleInput = useCallback((focusNode: HTMLElement) => {
        focusNodeRef.current = focusNode?.nodeType === 3 ? (focusNode?.parentElement as HTMLElement) : focusNode;
    }, []);

    const handleClickContextMenu = useCallback((e: Event) => {
        const focusElement = e.target as HTMLElement;
        focusNodeRef.current = focusElement;
    }, []);

    const handleDecorateParent = useCallback((newStyle: StyleProps) => {
        setStyleParent({ ...styleParent, ...newStyle });
    }, []);

    const tooltipContext = useMemo(
        () => ({
            style,
            updateActualStyle,
            tag,
            updateStyle,
            focusNodeRef,
            actualStyleRef,
            updateTag,
            handleClick,
            handleUpdateSelect,
            handleInput,
            handleClickContextMenu,
            handleDecorateParent,
            styleParent,
        }),
        [style, updateActualStyle, tag, styleParent]
    );

    useLayoutEffect(() => {
        editor.registerStyleObserver(tooltipContext);
        editor.registerInputObserver(tooltipContext);
        editor.registerClickObserver(tooltipContext);
        editor.registerSelectObserver(tooltipContext);
        editor.registerTagUpdateObserver(tooltipContext);
        editor.registerClickContextMenuObserver(tooltipContext);
    }, []);

    return <TooltipContext.Provider value={tooltipContext}>{children}</TooltipContext.Provider>;
};

export const useTooltip = () => {
    const tooltipContext = useContext(TooltipContext);
    if (!tooltipContext) {
        throw new Error('useTooltip must be used within an LexicalProvider');
    }
    return tooltipContext;
};
