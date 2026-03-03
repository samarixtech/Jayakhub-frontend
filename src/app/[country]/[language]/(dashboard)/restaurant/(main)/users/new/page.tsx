import { Metadata } from "next";
import UserFormView from "@/components/modules/restaurant/users/views/UserFormView";

export const metadata: Metadata = {
  title: "Add New User | Restaurant Dashboard",
  description: "Create a new user account.",
};

export default function NewUserPage() {
  return <UserFormView mode="add" />;
}
