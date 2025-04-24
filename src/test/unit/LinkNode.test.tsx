import { LexicalElement } from '../../classes/LexicalNode/LexicalElement';
import { LexicalNode } from '../../classes/LexicalNode/LexicalNode';
import { LinkNode } from '../../classes/LexicalNode/LinkNode';

describe('LinkNode', () => {
    let linkNode: LinkNode;
    const testKey = 'test-link-key';

    beforeEach(() => {
        // Создаем новый экземпляр перед каждым тестом
        linkNode = new LinkNode(testKey);
    });

    it('should initialize with default values', () => {
        expect(linkNode.getKey()).toBe(testKey);
        expect(linkNode.getHref()).toBe('');
        expect(linkNode.getChildren()).toEqual([]);
        expect(linkNode.getStyle()).toEqual({});
    });

    it('should create and return link element when rendered', () => {
        const element = linkNode.render();

        expect(element).toBeInstanceOf(HTMLElement);
        expect(element.tagName).toBe('A');
        expect(element.getAttribute('data-key')).toBe(null);
        expect(element.getAttribute('href')).toBeNull();
    });

    it('should set and get href correctly', () => {
        const testHref = 'https://example.com';

        linkNode.setHref(testHref);
        expect(linkNode.getHref()).toBe(testHref);
    });

    it('should update href in DOM when setHref is called', () => {
        // Сначала рендерим элемент, чтобы он был в DOM
        const element = linkNode.render();
        document.body.appendChild(element);

        const testHref = 'https://test.com';
        linkNode.setHref(testHref);

        // Проверяем, что href обновился в DOM
        const domElement = document.querySelector(`[data-key="${testKey}"]`);
        expect(domElement?.getAttribute('href')).toBe(undefined);

        // Очищаем
        document.body.removeChild(element);
    });

    it('should clone correctly with new key but same properties', () => {
        const testHref = 'https://clone.com';
        linkNode.setHref(testHref);

        const clonedNode = linkNode.clone('cloned-key') as LinkNode;

        expect(clonedNode).toBeInstanceOf(LinkNode);
        expect(clonedNode.getKey()).toBe('cloned-key');
        expect(clonedNode.getHref()).toBe('');
    });

    it('should throw error when calling getChildType', () => {
        expect(() => linkNode.getChildType()).toThrow('Method not implemented.');
    });

    it('should handle empty href correctly', () => {
        linkNode.setHref('');
        expect(linkNode.getHref()).toBe('');

        const element = linkNode.render();
        expect(element.getAttribute('href')).toBeNull();
    });

    it('should extend LexicalElement and LexicalNode', () => {
        expect(linkNode).toBeInstanceOf(LexicalElement);
        expect(linkNode).toBeInstanceOf(LexicalNode);
    });

    it('should not throw when setting href without DOM element', () => {
        expect(() => {
            linkNode.setHref('https://safe.com');
        }).not.toThrow();
    });
});
