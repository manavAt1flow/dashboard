import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertDescription, AlertTitle } from "../alert";
import {
  CommandLineIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <CommandLineIcon className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <ExclamationCircleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Your storage is almost full. Please free up some space.
      </AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  render: () => (
    <Alert>
      <InformationCircleIcon className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        A new software update is available. Would you like to install it now?
      </AlertDescription>
    </Alert>
  ),
};
