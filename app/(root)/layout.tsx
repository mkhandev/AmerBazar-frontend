import Footer from "@/components/Footer/Index";
import Navbar from "@/components/navbar/Navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="container flex-1 mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
