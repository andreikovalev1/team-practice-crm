"use client"

import Sidebar from "@/features/layout/Sidebar";
import Header from "@/components/header/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex min-h-screen bg-white pb-16 md:pb-0">
      <Sidebar />
      <main className="flex-1 w-full min-w-0">
        <Header />
        {children}
      </main>
    </div>
  );
}