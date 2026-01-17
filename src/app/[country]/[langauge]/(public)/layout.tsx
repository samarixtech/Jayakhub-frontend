import Navbar from "@/components/Navbar"; // your navbar component
import Footer from "@/components/Footer"; // optional

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
   <div>
       {children}
    </div>
      <Footer />
    </>
  );
}
