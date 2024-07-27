import type { Meta } from '@storybook/react';

import { Container, IContainerProps } from '.';

const meta: Meta<typeof Container> = {
    component: Container,
};

export default meta;
type Story = IContainerProps;

export const BaseContainer: Story = {
    children: 'tedhcdsfvsd',
};
