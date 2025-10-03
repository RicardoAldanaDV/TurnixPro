import "./globals.css";
import LayoutWrapper from "./layoutWrapper";

export const metadata = {
  title: "Turnixpro",
  description: "Gestión de Turnos - Turnixpro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-900 text-white">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
