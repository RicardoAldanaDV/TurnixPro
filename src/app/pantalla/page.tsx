"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function PantallaPage() {
  const [pantallaAbierta, setPantallaAbierta] = useState<Window | null>(null);

  // Abrir ventana secundaria
  const abrirPantalla = () => {
    if (!pantallaAbierta || pantallaAbierta.closed) {
      const nuevaVentana = window.open(
        "/pantalla-ventana",
        "Pantalla",
        "width=800,height=600"
      );
      setPantallaAbierta(nuevaVentana);
    } else {
      pantallaAbierta.focus();
    }
  };

  // Cerrar ventana secundaria
  const cerrarPantalla = () => {
    if (pantallaAbierta && !pantallaAbierta.closed) {
      pantallaAbierta.close();
      setPantallaAbierta(null);
    }
  };

  // Maximizar (fullscreen dentro de la ventana)
  const maximizarPantalla = () => {
    if (pantallaAbierta && !pantallaAbierta.closed) {
      pantallaAbierta.focus();

      try {
        pantallaAbierta.document.documentElement
          .requestFullscreen()
          .catch((err) => {
            console.error("❌ Error al intentar fullscreen:", err);
            alert("Tu navegador bloqueó el fullscreen. Pulsa F11 en la pantalla.");
          });
      } catch (error) {
        console.error("Fullscreen no soportado:", error);
        alert("Este navegador no soporta el fullscreen directo.");
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-neutral-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Pantalla de Llamadas</h1>

      <div className="flex gap-4">
        <Button
          onClick={abrirPantalla}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Abrir Pantalla
        </Button>
        <Button
          onClick={maximizarPantalla}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Maximizar
        </Button>
        <Button
          onClick={cerrarPantalla}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Cerrar Pantalla
        </Button>
      </div>
    </div>
  );
}
