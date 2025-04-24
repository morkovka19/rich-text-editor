/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    createHeadingElement,
    createLineBreak,
    createLinkElement,
    createNewListElement,
    createNewListItemElement,
    createParagraphElement,
    createTextElement,
    getDOMElement,
    getLastChild,
    getMinElement,
    removeChildElement,
    setupMutationObserver,
    updateHrefLinkElement,
    updateTextContent,
} from '../../utils/DOMUtils';
import { TAGS } from '../../utils/constants';

describe('DOM Element Creation', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('createParagraphElement creates a paragraph with correct id', () => {
        const key = 'p1';
        const p = createParagraphElement(key);

        expect(p.tagName).toBe(TAGS.NORMAL.toUpperCase());
        expect(p.id).toBe(key);
    });

    test('createLinkElement creates a link with correct id', () => {
        const key = 'a1';
        const a = createLinkElement(key);

        expect(a.tagName).toBe(TAGS.LINK.toUpperCase());
        expect(a.id).toBe(key);
    });

    test('createHeadingElement creates heading with correct level and id', () => {
        const key = 'h1';
        const level = 2;
        const h = createHeadingElement(key, level);

        expect(h.tagName).toBe(`H${level}`.toUpperCase());
        expect(h.id).toBe(key);
    });

    test('createNewListElement creates ordered list with correct id', () => {
        const key = 'ol1';
        const ol = createNewListElement(key, TAGS.OL);

        expect(ol.tagName).toBe(TAGS.OL.toUpperCase());
        expect(ol.id).toBe(key);
    });

    test('createNewListElement creates unordered list with correct id', () => {
        const key = 'ul1';
        const ul = createNewListElement(key, TAGS.UL);

        expect(ul.tagName).toBe(TAGS.UL.toUpperCase());
        expect(ul.id).toBe(key);
    });

    test('createTextElement creates text element with correct id', () => {
        const key = 'text1';
        const text = createTextElement(key);

        expect(text.tagName).toBe(TAGS.TEXT.toUpperCase());
        expect(text.id).toBe(key);
    });

    test('createNewListItemElement creates list item with correct id', () => {
        const key = 'li1';
        const li = createNewListItemElement(key);

        expect(li.tagName).toBe('LI');
        expect(li.id).toBe(key);
    });

    test('createLineBreak creates br element', () => {
        const br = createLineBreak();
        expect(br.tagName).toBe('BR');
    });
});

describe('DOM Manipulation', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('getDOMElement returns correct element', () => {
        const key = 'test1';
        const div = document.createElement('div');
        div.id = key;
        document.body.appendChild(div);

        const found = getDOMElement(key);
        expect(found).toBe(div);
    });

    test('updateTextContent updates text content', () => {
        const key = 'text1';
        const p = document.createElement('p');
        p.id = key;
        document.body.appendChild(p);

        const text = 'Hello World';
        const updated = updateTextContent(key, text);

        expect(updated.textContent).toBe(text);
    });

    test('updateHrefLinkElement updates href attribute', () => {
        const key = 'link1';
        const a = document.createElement('a');
        a.id = key;
        document.body.appendChild(a);

        const href = 'https://example.com';
        updateHrefLinkElement(key, href);

        expect(a.getAttribute('href')).toBe(href);
    });

    test('removeChildElement removes child from parent', () => {
        const parentKey = 'parent1';
        const childKey = 'child1';

        const parent = document.createElement('div');
        parent.id = parentKey;

        const child = document.createElement('div');
        child.id = childKey;

        parent.appendChild(child);
        document.body.appendChild(parent);

        removeChildElement(parentKey, childKey);

        expect(document.getElementById(childKey)).toBeNull();
        expect(parent.childNodes.length).toBe(0);
    });
});

describe('DOM Traversal', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('getLastChild returns text element when element is text', () => {
        const text = document.createElement(TAGS.TEXT);
        text.id = 'text1';
        document.body.appendChild(text);

        const result = getLastChild(text);
        expect(result).toBe(text);
    });

    test('getLastChild returns undefined for empty element', () => {
        const div = document.createElement('div');
        div.id = 'div1';
        document.body.appendChild(div);

        const result = getLastChild(div);
        expect(result).toBeUndefined();
    });

    test('getMinElement returns parent for text node', () => {
        const div = document.createElement('div');
        div.id = 'div1';
        const text = document.createTextNode('text');
        div.appendChild(text);
        document.body.appendChild(div);

        const result = getMinElement(text as unknown as any);
        expect(result).toBe(div);
    });

    test('getMinElement returns last child for nested structure', () => {
        const div = document.createElement('div');
        div.id = 'div1';

        const ul = document.createElement('ul');
        ul.id = 'ul1';

        const li = document.createElement('li');
        li.id = 'li1';

        const text = document.createElement(TAGS.TEXT);
        text.id = 'text1';

        li.appendChild(text);
        ul.appendChild(li);
        div.appendChild(ul);
        document.body.appendChild(div);

        const result = getMinElement(div);
        expect(result).toBe(text);
    });

    test('getMinElement returns undefined for null element', () => {
        const result = getMinElement(null);
        expect(result).toBeUndefined();
    });
});

describe('MutationObserver', () => {
    test('setupMutationObserver sets up observer with correct options', () => {
        const container = document.createElement('div');
        const callback = jest.fn();

        // Mock MutationObserver
        const observeMock = jest.fn();
        const MockMutationObserver = jest.fn(() => ({
            observe: observeMock,
            disconnect: jest.fn(),
        }));

        // Заменяем глобальный MutationObserver на мок
        const originalMutationObserver = window.MutationObserver;
        (window as any).MutationObserver = MockMutationObserver;

        const observer = setupMutationObserver(container, callback);

        expect(MockMutationObserver).toHaveBeenCalled();
        expect(observeMock).toHaveBeenCalledWith(container, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        // Восстанавливаем оригинальный MutationObserver
        (window as any).MutationObserver = originalMutationObserver;
    });
});
