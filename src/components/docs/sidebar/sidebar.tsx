import { SidebarProps } from "fumadocs-ui/layouts/docs/sidebar";
import { SidebarProvider } from "fumadocs-ui/provider";
import { FC } from "react";

const Sidebar: FC<SidebarProps> = (props) => {
  return <SidebarProvider>{props.children}</SidebarProvider>;
};

export default Sidebar;
