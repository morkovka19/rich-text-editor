import { EDITOR_ID, MAIN_DIV_ID } from '../helpers/constants';
import { createMutationObserver } from '../helpers/createMutationObserver';

export const initialScript = () => {
    if (!document.getElementById(MAIN_DIV_ID)) {
        const parentElement = document.getElementById(EDITOR_ID);
        const root = document.createElement('div');
        root.id = MAIN_DIV_ID;
        parentElement?.appendChild(root);
        root.style.minHeight = '10px';
        root.focus();

        createMutationObserver(MAIN_DIV_ID);
    }
};
