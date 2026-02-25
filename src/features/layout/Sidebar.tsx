"use client";
import { ROUTES } from "@/app/configs/routesConfig"
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-black text-white p-6">
      <h2 className="text-xl font-bold mb-8">CRM</h2>

      <nav className="flex flex-col gap-4">
        <Link
          href={ROUTES.HOME}
          className="hover:text-gray-400 transition"
        >
          Employees
        </Link>

        <Link
          href="#"
          className="hover:text-gray-400 transition"
        >
          Skills
        </Link>

        <Link
          href="#"
          className="hover:text-gray-400 transition"
        >
          Languages
        </Link>

                <Link
          href="#"
          className="hover:text-gray-400 transition"
        >
          CVs
        </Link>
      </nav>
    </aside>
  );
}