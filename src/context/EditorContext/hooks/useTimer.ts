import { HISTORY_TIMEOUT } from '../../../helpers/constants';

const useTimer = () => {
    let timer: NodeJS.Timeout | undefined;

    const startTimer = (callback: () => void) => {
        if (typeof timer !== 'undefined') {
            clearTimeout(timer);
        }

        timer = setTimeout(callback, HISTORY_TIMEOUT);
    };

    return {
        startTimer,
    };
};

export default useTimer;
