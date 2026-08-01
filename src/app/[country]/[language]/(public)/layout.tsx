import Navbar from "@/components/modules/public-website/layout/Navbar"; // your navbar component
import Footer from "@/components/modules/public-website/layout/Footer"; // optional

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="landing-navy-theme">
      <Navbar />
      <div className="pt-20">{children}</div>
      <Footer />
    </div>
  );
}
