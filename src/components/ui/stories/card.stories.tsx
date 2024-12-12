import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { Button } from "../button";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Your new project will be created in your organization.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Update your account information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className="w-full px-3 py-2 border rounded-md"
            defaultValue="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            defaultValue="john@example.com"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save changes</Button>
      </CardFooter>
    </Card>
  ),
};

export const Pricing: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Pro Plan</CardTitle>
        <CardDescription>$29/month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Includes:</p>
        <ul className="ml-6 list-disc [&>li]:mt-2">
          <li>Unlimited projects</li>
          <li>Priority support</li>
          <li>Custom domain</li>
          <li>Analytics dashboard</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Upgrade now</Button>
      </CardFooter>
    </Card>
  ),
};
