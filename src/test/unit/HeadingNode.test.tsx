/* eslint-disable @typescript-eslint/no-var-requires */
import { HeadingNode } from '../../classes/LexicalNode/HeadingNode';
import { LexicalNode } from '../../classes/LexicalNode/LexicalNode';
import { TAGS } from '../../utils/constants';

describe('HeadingNode', () => {
    let originalGenerateKey: () => string;

    beforeAll(() => {
        // Сохраняем оригинальную функцию генерации ключа
        originalGenerateKey = require('../../utils/generateKey').generateKey;
    });

    afterAll(() => {
        // Восстанавливаем оригинальную функцию
        require('../../utils/generateKey').generateKey = originalGenerateKey;
    });

    beforeEach(() => {
        // Мокаем только generateKey, так как он не является частью тестируемой логики
        jest.spyOn(require('../../utils/generateKey'), 'generateKey').mockReturnValue('mocked-key');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create instance with default values', () => {
        const node = new HeadingNode();
        expect(node.getRange()).toBeUndefined();
        expect(node.getChildren()).toEqual([]);
    });

    it('should create instance with custom key and range', () => {
        const node = new HeadingNode('custom-key', 2);

        expect(node.getKey()).toBe('custom-key');
        expect(node.getRange()).toBe(2);
    });

    it('should render correct heading element', () => {
        const node = new HeadingNode(undefined, 3);
        const element = node.render();

        expect(element.tagName).toBe('H3');
        expect(element.getAttribute('data-key')).toBe(null);
        expect(element.textContent).toBe('');
    });

    it('should render with different range values', () => {
        const testCases = [
            { range: 1, expectedTag: 'H1' },
            { range: 2, expectedTag: 'H2' },
            { range: 6, expectedTag: 'H6' },
        ];

        testCases.forEach(({ range, expectedTag }) => {
            const node = new HeadingNode(undefined, range);
            const element = node.render();
            expect(element.tagName).toBe(expectedTag);
        });
    });

    it('should return correct child type', () => {
        const node = new HeadingNode();
        expect(node.getChildType()).toBe(TAGS.TEXT);
    });

    it('should manage children correctly', () => {
        const node = new HeadingNode();
        expect(node.getChildren()).toEqual([]);

        node.getChildren().push('child1', 'child2');
        expect(node.getChildren()).toEqual(['child1', 'child2']);
    });

    it('should clone node with new key but same range', () => {
        const originalNode = new HeadingNode('original-key', 4);
        const clonedNode = originalNode.clone() as HeadingNode;

        expect(clonedNode).toBeInstanceOf(HeadingNode);
        expect(clonedNode.getKey()).not.toBe('original-key');
        expect(clonedNode.getRange()).toBe(4);
        expect(clonedNode.getChildren()).toEqual([]);
    });

    it('should clone node with specified key', () => {
        const originalNode = new HeadingNode(undefined, 2);
        const clonedNode = originalNode.clone('custom-clone-key') as HeadingNode;

        expect(clonedNode.getKey()).toBe('custom-clone-key');
    });

    it('should set and get range correctly', () => {
        const node = new HeadingNode();

        node.setRange(5);
        expect(node.getRange()).toBe(5);

        node.setRange(1);
        expect(node.getRange()).toBe(1);
    });

    it('should extend LexicalElement and LexicalNode', () => {
        const node = new HeadingNode();
        expect(node).toBeInstanceOf(LexicalNode);
    });
});
