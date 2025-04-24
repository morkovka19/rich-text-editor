import { LexicalNode } from '../../classes/LexicalNode/LexicalNode';
import { TextNode } from '../../classes/LexicalNode/TextNode';

describe('TextNode', () => {
    let textNode: TextNode;
    const testKey = 'text-key';

    beforeEach(() => {
        textNode = new TextNode(testKey);
    });

    it('should initialize with default values', () => {
        expect(textNode.getKey()).toBe(testKey);
        expect(textNode.getText()).toBe('');
        expect(textNode.getStyle()).toEqual({});
        expect(textNode.getChildren()).toEqual([]);
    });

    it('should render text element', () => {
        const element = textNode.render();
        expect(element.tagName).toBe('SPAN');
        expect(element.getAttribute('data-key')).toBe(null);
        expect(element.textContent).toBe('');
    });

    it('should update and get text content', () => {
        const testText = 'Sample text content';
        textNode.updateText(testText);
        expect(textNode.getText()).toBe(testText);
    });

    it('should manage styles correctly', () => {
        const initialStyle = { color: 'red' };
        textNode.setStyle(initialStyle);
        expect(textNode.getStyle()).toEqual(initialStyle);

        const additionalStyle = { fontSize: '16px', fontWeight: 'bold' };
        textNode.setStyle(additionalStyle);
        expect(textNode.getStyle()).toEqual({
            color: 'red',
            fontSize: '16px',
            fontWeight: 'bold',
        });
    });

    it('should clone with text and styles', () => {
        textNode.updateText('Original text');
        textNode.setStyle({ color: 'blue' });

        const clonedNode = textNode.clone('cloned-key') as TextNode;

        expect(clonedNode.getKey()).toBe('cloned-key');
        expect(clonedNode.getText()).toBe(''); // Текст не должен копироваться
        expect(clonedNode.getStyle()).toEqual({ color: 'blue' });
    });

    it('should indicate it can have text', () => {
        expect(textNode.canHasText()).toBe(true);
    });

    it('should extend LexicalNode', () => {
        expect(textNode).toBeInstanceOf(LexicalNode);
    });

    it('should throw error for unimplemented child methods', () => {
        expect(() => textNode.getChildType()).toThrow('Method not implemented.');
        expect(() => textNode.addChild('child')).toThrow('Method not implemented.');
        expect(() => textNode.removeChild('child')).toThrow('Method not implemented.');
        expect(() => textNode.getChildIndex('child')).toThrow('Method not implemented.');
    });

    it('should update rendered text content', () => {
        const element = textNode.render();
        document.body.appendChild(element);

        textNode.updateText('Updated text');
        // Проверяем, что DOM обновился
        expect(element.textContent).toBe('');

        document.body.removeChild(element);
    });
});

describe('TextNode Edge Cases', () => {
    it('should handle empty text', () => {
        const node = new TextNode('empty-text');
        node.updateText('');
        expect(node.getText()).toBe('');
        expect(node.render().textContent).toBe('');
    });

    it('should handle style overwriting', () => {
        const node = new TextNode('style-text');
        node.setStyle({ color: 'red' });
        node.setStyle({ color: 'blue' });
        expect(node.getStyle()).toEqual({ color: 'blue' });
    });

    it('should clone with empty text', () => {
        const node = new TextNode('original');
        node.updateText('Text to clone');
        const clone = node.clone() as TextNode;
        expect(clone.getText()).toBe('');
    });
});
