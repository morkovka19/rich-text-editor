import { generateKey } from '../../utils/generateKey';

describe('generateKey', () => {
    // Сохраняем оригинальные реализации
    const originalGetElementById = document.getElementById;
    const originalDateNow = Date.now;

    beforeEach(() => {
        // Мокаем Date.now для предсказуемых значений
        jest.spyOn(Date, 'now').mockReturnValue(1234567890);

        // Правильно мокаем getElementById
        document.getElementById = jest.fn().mockImplementation(() => null);
    });

    afterEach(() => {
        // Восстанавливаем оригинальные реализации
        Date.now = originalDateNow;
        document.getElementById = originalGetElementById;
        jest.clearAllMocks();
    });

    test('should generate key with timestamp and random suffix', () => {
        const key = generateKey();
        expect(key).toMatch(/^1234567890[A-Z]{2}\d{3}$/);
    });

    test('should retry if generated key exists in DOM', () => {
        // Первый вызов вернет существующий элемент, второй - null
        (document.getElementById as jest.Mock)
            .mockImplementationOnce(() => ({})) // Элемент существует
            .mockImplementationOnce(() => null); // Элемент не существует

        const key = generateKey();
        expect(key).toMatch(/^1234567890[A-Z]{2}\d{3}$/);
        expect(document.getElementById).toHaveBeenCalledTimes(2);
    });
});
