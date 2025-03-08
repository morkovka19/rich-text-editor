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

import { initialStyle } from '../../utils/styleUtils';
import { useEditor } from '../LexicalContext';

export type TooltipContextProps = {
    style: StyleProps;
    tag: string;
    updateStyle: (newStyleProp: StyleProps) => void;
    actualStyleRef: React.MutableRefObject<StyleProps>;
    updateActualStyle: (styleNew: StyleProps) => void;
    updateTag: (tag: string) => void;
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
    const [tag, setTag] = useState('p');
    const actualStyle: StyleProps = {};
    const actualStyleRef = useRef<StyleProps>(actualStyle);

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
        },
        [editor]
    );
    const click = useCallback(() => {}, []);

    const updateStyle = useCallback((newStyleProp: StyleProps) => {
        setStyle(prev => ({ ...prev, ...newStyleProp }));
    }, []);

    const updateTag = useCallback((tag: string) => {
        setTag(tag);
    }, []);

    const tooltipContext = useMemo(
        () => ({ style, updateActualStyle, tag, updateStyle, click, actualStyleRef, updateTag }),
        [style, togetherSetStyle, updateActualStyle, tag, updateStyle, click, updateTag]
    );

    useLayoutEffect(() => {
        editor.registerStyleObserver(tooltipContext);
        editor.registerClickObserver(tooltipContext);
        editor.registerTagUpdateObserver(tooltipContext);
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
