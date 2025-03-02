/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-refresh/only-export-components */
import {
    FC,
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { getStyleState, getStyleString, initialStyle } from '../../utils/styleUtils';
import { useEditor } from '../LexicalContext';

type TooltipContextProps = {
    style: StyleProps;
    togetherSetStyle: (styleNew: StyleProps) => void;
    updateActualStyle: (styleNew: StyleProps) => void;
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
    const actualStyle: StyleProps = {};
    const actualStyleRef = useRef<StyleProps>(actualStyle);

    const triggerClickForStyle = useCallback((target: HTMLElement | null) => {
        const focusStyle = target?.style.cssText;
        if (focusStyle !== getStyleString(actualStyleRef.current)) {
            setStyle(() => ({ ...initialStyle, ...getStyleState(focusStyle || '') }));
        }
    }, []);

    useEffect(() => editor.setTriggerClickForStyle(triggerClickForStyle), []);

    const updateActualStyle = useCallback(
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
        [actualStyle]
    );

    const togetherSetStyle = useCallback(
        (styleNew: StyleProps) => {
            setStyle(prev => ({ ...prev, ...styleNew }));
            editor.triggerDecoratedUpdate(actualStyleRef.current);
        },
        [editor]
    );
    const tooltipContext = useMemo(
        () => ({ style, togetherSetStyle, updateActualStyle }),
        [style, togetherSetStyle, updateActualStyle]
    );

    return <TooltipContext.Provider value={tooltipContext}>{children}</TooltipContext.Provider>;
};

export const useTooltip = () => {
    const tooltipContext = useContext(TooltipContext);
    if (!tooltipContext) {
        throw new Error('useTooltip must be used within an LexicalProvider');
    }
    return tooltipContext;
};
