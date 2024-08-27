import { createEvent } from '../../../helpers/createEvent';

export const onInput = (e: Event, editor: React.RefObject<HTMLDivElement>) => {
    e.preventDefault();
    editor.current?.dispatchEvent(createEvent('inputEditor'));
};
