import { defineConfig } from '@playwright/test';

export default defineConfig({
    testIgnore: ['**/icons/**', '**/*.svg', '**/happydom.ts'],
});
