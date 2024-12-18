export const MAX = 50;
export const MIN = 1;

export const initialState = { count: 14 };

export const reducer = (state: { count: number }, action: { type: string; value?: string }) => {
    switch (action.type) {
        case 'increment': {
            if (state.count + 1 > MAX) return { count: MAX };
            return { count: state.count + 1 };
        }

        case 'decrement': {
            if (state.count - 1 < MIN) return { count: MIN };
            return { count: state.count - 1 };
        }
        case 'input': {
            if (action.value) {
                const numValue = Number(action.value);
                if (numValue > MAX) return { count: MAX };
                if (numValue < MIN) return { count: MIN };
                return { count: numValue };
            }
            return { count: state.count };
        }
        default:
            throw new Error('Unknown action type');
    }
};
