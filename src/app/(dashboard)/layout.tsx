import Sidebar from "@/features/layout/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black pb-16 md:pb-0">
      <Sidebar />
      <main className="flex-1 w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}