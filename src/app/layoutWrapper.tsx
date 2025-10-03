"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const esPantalla = pathname.startsWith("/pantalla-ventana");

  if (esPantalla) {
    // 👇 Solo mostramos el contenido de la pantalla, sin header ni padding
    return <>{children}</>;
  }

  return (
    <>
      <header className="w-full border-b border-neutral-800 bg-neutral-950 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Coatepeque Gestión</h1>
        <nav className="flex space-x-6">
          <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link href="/nuevo-registro" className="hover:text-blue-400">Nuevo Registro</Link>
          <Link href="/archivo" className="hover:text-blue-400">Archivo</Link>
          <Link href="/pantalla" className="hover:text-blue-400">Pantalla</Link>
        </nav>
      </header>

      <main className="p-6">{children}</main>
    </>
  );
}
