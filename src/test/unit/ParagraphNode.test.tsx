import { LexicalElement } from '../../classes/LexicalNode/LexicalElement';
import { LexicalNode } from '../../classes/LexicalNode/LexicalNode';
import { ParagraphNode } from '../../classes/LexicalNode/ParagraphNode';
import { TAGS } from '../../utils/constants';

describe('ParagraphNode', () => {
    let paragraphNode: ParagraphNode;
    const testKey = 'paragraph-key';

    beforeEach(() => {
        paragraphNode = new ParagraphNode(testKey);
    });

    it('should initialize with default values', () => {
        expect(paragraphNode.getKey()).toBe(testKey);
        expect(paragraphNode.getChildren()).toEqual([]);
        expect(paragraphNode.getStyle()).toEqual({});
    });

    it('should render paragraph element', () => {
        const element = paragraphNode.render();

        expect(element).toBeInstanceOf(HTMLElement);
        expect(element.tagName).toBe('P');
        expect(element.getAttribute('data-key')).toBe(null);
        expect(element.textContent).toBe('');
    });

    it('should return TEXT as child type', () => {
        expect(paragraphNode.getChildType()).toBe(TAGS.TEXT);
    });

    it('should clone correctly with new key', () => {
        // Добавляем детей для проверки, что они не копируются
        paragraphNode.getChildren().push('child1', 'child2');

        const clonedNode = paragraphNode.clone('cloned-key') as ParagraphNode;

        expect(clonedNode).toBeInstanceOf(ParagraphNode);
        expect(clonedNode.getKey()).toBe('cloned-key');
        expect(clonedNode.getChildren()).toEqual([]); // Дети не должны копироваться
    });

    it('should manage children correctly', () => {
        const child1 = 'child1';
        const child2 = 'child2';

        paragraphNode.getChildren().push(child1);
        expect(paragraphNode.getChildren()).toEqual([child1]);

        paragraphNode.getChildren().push(child2);
        expect(paragraphNode.getChildren()).toEqual([child1, child2]);

        paragraphNode.getChildren().pop();
        expect(paragraphNode.getChildren()).toEqual([child1]);
    });

    it('should extend LexicalElement and LexicalNode', () => {
        expect(paragraphNode).toBeInstanceOf(LexicalElement);
        expect(paragraphNode).toBeInstanceOf(LexicalNode);
    });

    it('should handle style changes', () => {
        const style = { color: 'red', fontSize: '16px' };
        paragraphNode.setStyle(style);
        expect(paragraphNode.getStyle()).toEqual(style);

        paragraphNode.setStyle({});
        expect(paragraphNode.getStyle()).toEqual({});
    });
});
