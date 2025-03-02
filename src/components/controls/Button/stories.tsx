import type { Meta } from '@storybook/react';

import Button, { IButtonProps } from '.';
import './Button.styles.scss';

const meta: Meta<typeof Button> = {
    component: Button,
};

export default meta;
type Story = IButtonProps;

export const BaseButton: Story = {
    theme: 'text',
    text: 'TimesNewRoman',
};
