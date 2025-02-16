import { useRef } from 'react';

import { TAGS } from '../../../helpers/constants';

export type TagType = {
    lastTag: string;
};

const useTags = () => {
    const tag: TagType = {
        lastTag: TAGS.NORMAL,
    };
    const tagRef = useRef(tag);
    tagRef.current = tag;

    const updateTag = (value: string) => {
        tagRef.current.lastTag = value;
    };

    return {
        updateTag,
        tag: tagRef.current,
    };
};

export default useTags;
