import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input.tsx'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search'] },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Enter text…', type: 'text' },
}

export const Email: Story = {
  args: { placeholder: 'email@example.com', type: 'email' },
}

export const Password: Story = {
  args: { placeholder: 'Password', type: 'password' },
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true, value: 'Cannot edit' },
}
