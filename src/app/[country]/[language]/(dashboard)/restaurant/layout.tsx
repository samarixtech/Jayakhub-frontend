import CustomerDashboardLayout from "@/components/modules/customer/layout/CustomerDashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>;
}
