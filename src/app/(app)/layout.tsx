import Navbar from "@/components/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <body>
        <Navbar />
        {children}
      </body>
    </>
  )
}