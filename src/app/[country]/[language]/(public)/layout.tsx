import Navbar from "@/components/modules/public-website/layout/Navbar"; // your navbar component
import Footer from "@/components/modules/public-website/layout/Footer"; // optional

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </>
  );
}
