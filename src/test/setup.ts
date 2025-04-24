import '@testing-library/jest-dom';
import 'bun:test';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost', // Чтобы избежать ошибок с относительными путями
});
global.document = dom.window.document;
global.navigator = dom.window.navigator;
