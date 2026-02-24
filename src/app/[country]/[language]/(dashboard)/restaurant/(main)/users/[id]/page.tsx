import { Metadata } from "next";
import UserFormView from "@/components/modules/restaurant/users/UserFormView";

export const metadata: Metadata = {
  title: "Edit User | Restaurant Dashboard",
  description: "Edit user details.",
};

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserFormView mode="edit" userId={id} />;
}
