import { LexicalElement } from '../../classes/LexicalNode/LexicalElement';
import { LexicalNode } from '../../classes/LexicalNode/LexicalNode';
import { RootNode } from '../../classes/LexicalNode/RootNode';
import { STYLE, TAGS } from '../../utils/constants';

describe('RootNode', () => {
    let rootNode: RootNode;
    const testKey = 'root-key';

    beforeEach(() => {
        rootNode = new RootNode(testKey);
    });

    it('should initialize with correct type and key', () => {
        expect(rootNode.getKey()).toBe(testKey);
        expect(rootNode.getChildren()).toEqual([]);
    });

    it('should render a block element with correct attributes', () => {
        const element = rootNode.render();

        expect(element.tagName).toBe(TAGS.BLOCK.toUpperCase());
        expect(element.id).toBe(TAGS.ROOT);
        expect(element.getAttribute(STYLE)).toBe('min-height: 400px');
    });

    it('should return NORMAL as child type', () => {
        expect(rootNode.getChildType()).toBe(TAGS.NORMAL);
    });

    it('should clone correctly with new key', () => {
        const clonedNode = rootNode.clone('new-root-key') as RootNode;

        expect(clonedNode).toBeInstanceOf(RootNode);
        expect(clonedNode.getKey()).toBe('new-root-key');
    });

    it('should clone with default ROOT key when no key provided', () => {
        const clonedNode = rootNode.clone() as RootNode;
        expect(clonedNode.getKey()).toBe(TAGS.ROOT);
    });

    it('should extend LexicalElement and LexicalNode', () => {
        expect(rootNode).toBeInstanceOf(LexicalElement);
        expect(rootNode).toBeInstanceOf(LexicalNode);
    });

    it('should maintain empty children array after cloning', () => {
        rootNode.getChildren().push('child1', 'child2');
        const clonedNode = rootNode.clone() as RootNode;

        expect(clonedNode.getChildren()).toEqual([]);
    });

    it('should create element with correct style in DOM', () => {
        const element = rootNode.render();
        document.body.appendChild(element);

        const domElement = document.getElementById(TAGS.ROOT);
        expect(domElement).not.toBeNull();
        expect(domElement?.style.minHeight).toBe('400px');

        document.body.removeChild(element);
    });
});
