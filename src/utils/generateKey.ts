const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const possibleNums = '0123456789';

const makeId = () => {
    let text = '';

    for (let i = 0; i < 2; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    for (let i = 0; i < 3; i++) {
        text += possibleNums.charAt(Math.floor(Math.random() * possibleNums.length));
    }
    return text;
};

export const generateKey = () => {
    let key = '';
    while (!key) {
        key = `${Date.now() + makeId()}`;
        if (document.getElementById(key)) key = '';
    }
    return key;
};
