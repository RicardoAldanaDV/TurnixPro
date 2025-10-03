"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

type Gestion = {
  ID: string;
  Nombres: string;
  Apellidos: string;
  Genero: string;
  FechaNacimiento: string;
  NombrePadre: string;
  NombreMadre: string;
  LugarNacimiento: string;
  Comentarios: string;
  Estado: string;
  FechaRegistro: string;
  FechaResolucion: string;
};

export default function DashboardPage() {
  const [pendientes, setPendientes] = useState<Gestion[]>([]);
  const [porLlamar, setPorLlamar] = useState<Gestion[]>([]);
  const [gestionSeleccionada, setGestionSeleccionada] = useState<Gestion | null>(null);

  const fetchGestiones = async () => {
    const res = await fetch("/api/get-gestiones");
    const data = await res.json();

    const todas: Gestion[] = data.data || [];
    setPendientes(todas.filter((g) => g.Estado.toLowerCase() === "pendiente"));
    setPorLlamar(todas.filter((g) => g.Estado.toLowerCase() === "por llamar"));
  };

  useEffect(() => {
    fetchGestiones();
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    await fetch("/api/update-gestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, nuevoEstado }),
    });
    fetchGestiones();
    setGestionSeleccionada(null);
  };

  return (
    <div className="min-h-screen p-6 bg-neutral-900 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pendientes */}
        <div className="bg-neutral-900 border border-blue-500 shadow-[0_0_15px_#00f] rounded-lg p-4">
          <h2 className="text-lg font-bold mb-3 text-blue-400">
            Pendientes ({pendientes.length})
          </h2>
          {pendientes.length === 0 && (
            <p className="text-blue-300 italic">No hay gestiones pendientes</p>
          )}
          {pendientes.map((g) => (
            <div
              key={g.ID}
              className="cursor-pointer border border-blue-500 rounded p-3 mb-2 hover:bg-blue-900/30 transition shadow-[0_0_6px_#00f]"
              onClick={() => setGestionSeleccionada(g)}
            >
              <p className="text-white font-bold">{g.ID}</p>
              <p className="text-gray-300">{g.Nombres} {g.Apellidos}</p>
            </div>
          ))}
        </div>

        {/* Por Llamar */}
        <div className="bg-neutral-900 border border-blue-500 shadow-[0_0_15px_#00f] rounded-lg p-4">
          <h2 className="text-lg font-bold mb-3 text-blue-400">
            Por Llamar ({porLlamar.length})
          </h2>
          {porLlamar.length === 0 && (
            <p className="text-blue-300 italic">No hay gestiones por llamar</p>
          )}
          {porLlamar.map((g) => (
            <div
              key={g.ID}
              className="cursor-pointer border border-blue-500 rounded p-3 mb-2 hover:bg-blue-900/30 transition shadow-[0_0_6px_#00f]"
              onClick={() => setGestionSeleccionada(g)}
            >
              <p className="text-white font-bold">{g.ID}</p>
              <p className="text-gray-300">{g.Nombres} {g.Apellidos}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalles con acciones */}
      <Dialog.Root open={!!gestionSeleccionada} onOpenChange={() => setGestionSeleccionada(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[500px] max-h-[80vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-neutral-900 border border-blue-500 shadow-[0_0_20px_#00f] p-6 rounded-lg text-white">
            <Dialog.Title className="text-lg font-bold text-blue-400 mb-4">
              📌 Detalles de la Gestión
            </Dialog.Title>
            {gestionSeleccionada && (
              <div className="space-y-2">
                <p><b>ID:</b> {gestionSeleccionada.ID}</p>
                <p><b>Nombres:</b> {gestionSeleccionada.Nombres}</p>
                <p><b>Apellidos:</b> {gestionSeleccionada.Apellidos}</p>
                <p><b>Género:</b> {gestionSeleccionada.Genero}</p>
                <p><b>Fecha de Nacimiento:</b> {gestionSeleccionada.FechaNacimiento}</p>
                <p><b>Nombre del Padre:</b> {gestionSeleccionada.NombrePadre}</p>
                <p><b>Nombre de la Madre:</b> {gestionSeleccionada.NombreMadre}</p>
                <p><b>Lugar de Nacimiento:</b> {gestionSeleccionada.LugarNacimiento}</p>

                <p className="font-bold">Comentarios:</p>
                <div className="max-h-32 overflow-y-auto p-2 bg-neutral-800 rounded border border-blue-500 text-sm">
                  {gestionSeleccionada.Comentarios || "Sin comentarios"}
                </div>

                <p><b>Fecha Registro:</b> {gestionSeleccionada.FechaRegistro}</p>
                <p><b>Fecha Resolución:</b> {gestionSeleccionada.FechaResolucion || "—"}</p>
              </div>
            )}
            <div className="flex justify-between items-center mt-6">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">
                  Cerrar
                </button>
              </Dialog.Close>

              {gestionSeleccionada?.Estado.toLowerCase() === "pendiente" && (
                <button
                  onClick={() => actualizarEstado(gestionSeleccionada.ID, "Por Llamar")}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white"
                >
                  Mover a Por Llamar
                </button>
              )}

              {gestionSeleccionada?.Estado.toLowerCase() === "por llamar" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => actualizarEstado(gestionSeleccionada.ID, "Resuelto")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                  >
                    Resuelto
                  </button>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
