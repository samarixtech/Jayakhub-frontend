import { Metadata } from "next";
import UsersListView from "@/components/modules/restaurant/users/UsersListView";

export const metadata: Metadata = {
  title: "Users & Roles | Restaurant Dashboard",
  description: "Manage users and roles for your restaurant.",
};

export default function UsersPage() {
  return <UsersListView />;
}
