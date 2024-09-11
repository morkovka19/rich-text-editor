/* eslint-disable @typescript-eslint/no-unused-vars */
import { createEvent } from './createEvent';

export const createMutationObserver = (key: string) => {
    const node = document.getElementById(key);
    const callback = (mutationList: MutationRecord[], _observer: MutationObserver) => {
        mutationList.forEach((mutation: MutationRecord) => {
            const targetNode = mutation.target.parentElement;
            switch (mutation.type) {
                case 'characterData': {
                    (targetNode || node)?.dispatchEvent(createEvent('inputEditor', { bubbles: true }));
                    break;
                }
                case 'childList': {
                    const newNode = mutation.addedNodes.item(0) as HTMLElement;
                    if (newNode?.tagName && newNode.tagName === 'BR')
                        node?.dispatchEvent(createEvent('keydownEnterEditor', { bubbles: true }));
                    break;
                }
            }
        });
    };

    const config = { attributes: true, childList: true, subtree: true, characterData: true };

    const observer = new MutationObserver(callback);

    if (node) {
        observer.observe(node, config);
    }
};
