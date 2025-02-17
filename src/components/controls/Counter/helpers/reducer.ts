export const MAX = 50;
export const MIN = 1;

export const initialState = { count: 14 };

export const reducer = (
    state: { count: number },
    action: { type: string; value?: string; handleUpdate?: (value: number) => void }
) => {
    switch (action.type) {
        case 'increment': {
            if (state.count + 1 > MAX) {
                if (action.handleUpdate) action.handleUpdate(MAX);
                return { count: MAX };
            }
            if (action.handleUpdate) action.handleUpdate(state.count + 1);
            return { count: state.count + 1 };
        }
        case 'decrement': {
            if (state.count - 1 < MIN) {
                if (action.handleUpdate) action.handleUpdate(MIN);
                return { count: MIN };
            }
            if (action.handleUpdate) action.handleUpdate(state.count - 1);
            return { count: state.count - 1 };
        }
        case 'input': {
            if (action.value) {
                const numValue = Number(action.value);
                if (numValue > MAX) {
                    if (action.handleUpdate) action.handleUpdate(MAX);
                    return { count: MAX };
                }
                if (numValue < MIN) {
                    if (action.handleUpdate) action.handleUpdate(MIN);
                    return { count: MIN };
                }
                if (action.handleUpdate) action.handleUpdate(numValue);
                return { count: numValue };
            }
            return { count: state.count };
        }
        default:
            throw new Error('Unknown action type');
    }
};
