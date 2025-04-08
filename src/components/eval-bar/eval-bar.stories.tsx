import type { Meta, StoryObj } from '@storybook/react'
import EvalBarDisplay from './eval-bar-display'

const meta: Meta<typeof EvalBarDisplay> = {
  title: 'Evaluation Bar',
  component: EvalBarDisplay,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof EvalBarDisplay>

export const Default: Story = {
  args: {
    evalValue: 50,
  },
  argTypes: {
    evalValue: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
      },
    },
  },
}
