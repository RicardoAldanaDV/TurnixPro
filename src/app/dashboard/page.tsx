"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GestionModal from "@/components/GestionModal";

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
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar gestiones desde Sheets
  const fetchGestiones = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/get-gestiones");
      const data = await res.json();

      if (data.data) {
        const todas: Gestion[] = data.data;
        setPendientes(todas.filter((g) => g.Estado === "Pendiente"));
        setPorLlamar(todas.filter((g) => g.Estado === "Por Llamar"));
      }
    } catch (error) {
      console.error("Error cargando gestiones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGestiones();
  }, []);

  // 🔹 Actualizar estado en Sheets
  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/update-gestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error en la actualización");
      await fetchGestiones(); // refrescar desde Sheets
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("❌ No se pudo actualizar la gestión.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Enviar gestión a la Pantalla (BroadcastChannel)
  const llamarGestion = (id: string) => {
    const canal = new BroadcastChannel("pantalla");

    // Armamos la lista de espera (máx 5)
    const enEspera = porLlamar
      .filter((g) => g.ID !== id)
      .slice(0, 5)
      .map((g) => g.ID);

    canal.postMessage({
      tipo: "llamar",
      data: { siguiente: id, enEspera },
    });

    canal.close();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 🟡 Pendientes */}
      <Card className="bg-neutral-800 border border-neutral-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">
            Pendientes ({pendientes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-gray-400">Cargando...</p>}
          {pendientes.length === 0 && !loading && (
            <p className="text-sm text-gray-400">No hay gestiones pendientes</p>
          )}
          {pendientes.map((g) => (
            <div
              key={g.ID}
              className="flex justify-between items-center p-3 rounded-md bg-neutral-900 mb-2"
            >
              <span className="font-medium text-gray-200">
                {g.ID} - {g.Nombres} {g.Apellidos}
              </span>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => actualizarEstado(g.ID, "Por Llamar")}
              >
                Mover a Por Llamar
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 🔵 Por Llamar */}
      <Card className="bg-neutral-800 border border-neutral-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">
            Por Llamar ({porLlamar.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {porLlamar.length === 0 && !loading && (
            <p className="text-sm text-gray-400">No hay gestiones por llamar</p>
          )}
          {porLlamar.map((g) => (
            <div
              key={g.ID}
              className="flex justify-between items-center p-3 rounded-md bg-neutral-900 mb-2"
            >
              <span className="font-medium text-gray-200">
                {g.ID} - {g.Nombres} {g.Apellidos}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => llamarGestion(g.ID)}
                >
                  Llamar
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => actualizarEstado(g.ID, "Resuelto")}
                >
                  Resuelto
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
