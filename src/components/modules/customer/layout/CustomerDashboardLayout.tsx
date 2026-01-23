import DashboardShell from "@/components/layouts/DashboardShell";
import CustomerHeader from "./CustomerHeader";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell header={<CustomerHeader />}>{children}</DashboardShell>
  );
}
