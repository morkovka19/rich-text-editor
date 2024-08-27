import { createEvent } from '../../../helpers/createEvent';

export const onClickEditor = (e: Event, editor: React.RefObject<HTMLDivElement>) => {
    e.preventDefault();
    editor.current?.dispatchEvent(createEvent('clickEditorEvent'));
};
