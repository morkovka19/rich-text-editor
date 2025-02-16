import { EDITOR_ID, MAIN_DIV_ID, TAGS } from '../constants';
import { createMutationObserver } from '../createMutationObserver';

export const initialScript = () => {
    if (!document.getElementById(MAIN_DIV_ID)) {
        const parentElement = document.getElementById(EDITOR_ID);
        const root = document.createElement(TAGS.BLOCK);
        root.id = MAIN_DIV_ID;
        parentElement?.appendChild(root);
        root.style.minHeight = '50px';
        root.focus();

        createMutationObserver(MAIN_DIV_ID);
    }
};
