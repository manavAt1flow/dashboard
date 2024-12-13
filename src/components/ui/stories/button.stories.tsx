import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Dashboard",
    variant: "default",
  },
};

export const Accent: Story = {
  args: {
    children: "Button",
    variant: "accent",
  },
};

export const Error: Story = {
  args: {
    children: "Button",
    variant: "error",
  },
};

export const Outline: Story = {
  args: {
    children: "Button",
    variant: "outline",
  },
};

export const Link: Story = {
  args: {
    children: "Button",
    variant: "link",
    size: "slate",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

export const Icon: Story = {
  args: {
    children: "🔥",
    size: "icon",
  },
};
