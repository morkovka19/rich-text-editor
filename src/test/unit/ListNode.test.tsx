import { LexicalElement } from '../../classes/LexicalNode/LexicalElement';
import { LexicalNode } from '../../classes/LexicalNode/LexicalNode';
import { ListItemNode, ListNode } from '../../classes/LexicalNode/ListNode';
import { TAGS } from '../../utils/constants';

describe('ListNode', () => {
    let listNode: ListNode;
    const testKey = 'list-key';

    beforeEach(() => {
        listNode = new ListNode(testKey);
    });

    it('should initialize with default values', () => {
        expect(listNode.getKey()).toBe(testKey);
        expect(listNode.getTypeList()).toBeUndefined();
        expect(listNode.getChildren()).toEqual([]);
    });

    it('should initialize with specified list type', () => {
        const olListNode = new ListNode(testKey, TAGS.OL);
        expect(olListNode.getTypeList()).toBe(TAGS.OL);
    });

    it('should render UL element by default', () => {
        const element = listNode.render();
        expect(element.tagName).toBe('UL');
        expect(element.getAttribute('data-key')).toBe(null);
    });

    it('should render OL element when type is OL', () => {
        const olListNode = new ListNode(testKey, TAGS.OL);
        const element = olListNode.render();
        expect(element.tagName).toBe('OL');
    });

    it('should return LI as child type', () => {
        expect(listNode.getChildType()).toBe(TAGS.LI);
    });

    it('should clone correctly with same list type', () => {
        const olListNode = new ListNode(testKey, TAGS.OL);
        const cloned = olListNode.clone('cloned-key') as ListNode;

        expect(cloned).toBeInstanceOf(ListNode);
        expect(cloned.getKey()).toBe('cloned-key');
        expect(cloned.getTypeList()).toBe(TAGS.OL);
    });

    it('should set and get list type correctly', () => {
        expect(listNode.getTypeList()).toBeUndefined();

        listNode.setTypeList(TAGS.OL);
        expect(listNode.getTypeList()).toBe(TAGS.OL);

        listNode.setTypeList(TAGS.UL);
        expect(listNode.getTypeList()).toBe(TAGS.UL);
    });

    it('should extend LexicalElement and LexicalNode', () => {
        expect(listNode).toBeInstanceOf(LexicalElement);
        expect(listNode).toBeInstanceOf(LexicalNode);
    });
});

describe('ListItemNode', () => {
    let listItemNode: ListItemNode;
    const testKey = 'list-item-key';

    beforeEach(() => {
        listItemNode = new ListItemNode(testKey);
    });

    it('should initialize with default values', () => {
        expect(listItemNode.getKey()).toBe(testKey);
        expect(listItemNode.getChildren()).toEqual([]);
    });

    it('should render LI element', () => {
        const element = listItemNode.render();
        expect(element.tagName).toBe('LI');
        expect(element.getAttribute('data-key')).toBe(null);
    });

    it('should return TEXT as child type', () => {
        expect(listItemNode.getChildType()).toBe(TAGS.TEXT);
    });

    it('should clone correctly with new key', () => {
        const cloned = listItemNode.clone() as ListItemNode;

        expect(cloned).toBeInstanceOf(ListItemNode);
        expect(cloned.getKey()).not.toBe(testKey);
    });

    it('should extend LexicalElement and LexicalNode', () => {
        expect(listItemNode).toBeInstanceOf(LexicalElement);
        expect(listItemNode).toBeInstanceOf(LexicalNode);
    });
});
