import type { Meta } from '@storybook/react';

import { IColorPickerProps } from '.';
import ColorPicker from '.';
import './ColorPicker.styles.scss';

const meta: Meta<typeof ColorPicker> = {
    component: ColorPicker,
};

export default meta;
type Story = IColorPickerProps;

export const ColorPickerBase: Story = {};
