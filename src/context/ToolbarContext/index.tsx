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

import { getLastChild } from '../../utils/DOMUtils';
import { NODE_TYPE_TEXT, STYLE, TAGS } from '../../utils/constants';
import { getStyleState, initialStyle, initialStyleParent } from '../../utils/styleUtils';
import { useEditor } from '../LexicalContext';

export type TooltipContextProps = {
    style: StyleProps;
    tag: string;
    handleDecorate: (newStyleProp: StyleProps) => void;
    actualStyleRef: React.MutableRefObject<StyleProps>;
    handleUpdateActualStyle: (styleNew: StyleProps) => void;
    handleUpdateTag: (tag: string) => void;
    focusNodeRef: React.MutableRefObject<HTMLElement | null>;
    handleClick: (e: Event) => void;
    handleSelect: (selection: Selection) => void;
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
    const [tag, setTag] = useState(TAGS.NORMAL);
    const focusElement: HTMLElement | null = null;
    const focusNodeRef = useRef<HTMLElement | null>(focusElement);
    const actualStyleRef = useRef<StyleProps>({});

    const handleUpdateActualStyle = useCallback(
        (styleNew: StyleProps) => {
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
        },
        [style]
    );

    const handleClick = useCallback((e: Event) => {
        const focusNode = getLastChild(e.target as HTMLElement);
        if (focusNode) {
            focusNodeRef.current = focusElement;
            const style = focusNode.getAttribute(STYLE) || '';
            const styleProps: StyleProps = getStyleState(style);
            actualStyleRef.current = styleProps;
            setStyle({ ...initialStyle, ...styleProps });
            const parentElement = focusNode.parentElement as HTMLElement;
            const parentTag = parentElement.localName;
            const styleParentActual = parentElement.getAttribute(STYLE) || '';
            const styleParentActualProps = getStyleState(styleParentActual);
            setStyleParent({ ...initialStyleParent, ...styleParentActualProps });
            setTag(parentTag as TAGS);
        }
    }, []);

    const handleDecorate = useCallback((newStyleProp: StyleProps) => {
        setStyle(prev => ({ ...prev, ...newStyleProp }));
    }, []);

    const handleUpdateTag = useCallback((tag: string) => {
        setTag(tag as TAGS);
        setStyle(initialStyle);
    }, []);

    const handleSelect = useCallback((selection: Selection) => {
        const focusElement = selection.focusNode as HTMLElement;

        focusNodeRef.current =
            focusElement?.nodeType === NODE_TYPE_TEXT ? (focusElement?.parentElement as HTMLElement) : focusElement;
    }, []);

    const handleInput = useCallback((focusNode: Node | null) => {
        focusNodeRef.current =
            (focusNode as HTMLElement)?.nodeType === NODE_TYPE_TEXT
                ? ((focusNode as HTMLElement)?.parentElement as HTMLElement)
                : (focusNode as HTMLElement);
    }, []);

    const handleClickContextMenu = useCallback((e: Event) => {
        const focusElement = e.target as HTMLElement;
        focusNodeRef.current = focusElement;
    }, []);

    const handleDecorateParent = useCallback(
        (newStyle: StyleProps) => {
            setStyleParent({ ...styleParent, ...newStyle });
        },
        [styleParent]
    );

    const context = useMemo(
        () => ({
            style,
            handleUpdateActualStyle,
            tag,
            handleDecorate,
            focusNodeRef,
            actualStyleRef,
            handleUpdateTag,
            handleClick,
            handleSelect,
            handleInput,
            handleClickContextMenu,
            handleDecorateParent,
            styleParent,
        }),
        [
            style,
            handleUpdateActualStyle,
            tag,
            handleDecorate,
            handleUpdateTag,
            handleClick,
            handleSelect,
            handleInput,
            handleClickContextMenu,
            handleDecorateParent,
            styleParent,
        ]
    );

    useLayoutEffect(() => {
        editor.registerObserver('handleInput', context);
        editor.registerObserver('handleDecorateParent', context);
        editor.registerObserver('handleDecorate', context);
        editor.registerObserver('handleClick', context);
        editor.registerObserver('handleSelect', context);
        editor.registerObserver('handleUpdateTag', context);
        editor.registerObserver('handleClickContextMenu', context);
    }, [context, editor]);

    return <TooltipContext.Provider value={context}>{children}</TooltipContext.Provider>;
};

export const useTooltip = () => {
    const tooltipContext = useContext(TooltipContext);
    if (!tooltipContext) {
        throw new Error('useTooltip must be used within an LexicalProvider');
    }
    return tooltipContext;
};
