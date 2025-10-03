"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

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

export default function ArchivoPage() {
  const [gestiones, setGestiones] = useState<Gestion[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchGestiones = async () => {
      const res = await fetch("/api/get-historial");
      const data = await res.json();
      setGestiones(data.data || []);
    };
    fetchGestiones();
  }, []);

  const filtradas = gestiones.filter(
    (g) =>
      g.ID.toLowerCase().includes(busqueda.toLowerCase()) ||
      g.Nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      g.Apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      g.FechaResolucion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const hacerBackup = async () => {
    const res = await fetch("/api/backup-excel");
    if (res.ok) {
      alert("✅ Backup creado en el escritorio!");
    } else {
      alert("❌ Error al crear backup.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-neutral-900 text-white">
      <Card className="bg-neutral-800 border border-neutral-700 shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            📂 Archivo de Gestiones Resueltas
          </CardTitle>
          <Button
            onClick={hacerBackup}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          >
            Descargar Backup
          </Button>
        </CardHeader>

        <CardContent>
          {/* Buscador */}
          <div className="mb-4">
            <Input
              placeholder="Buscar por nombre, ID o fecha..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder-gray-400"
            />
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto rounded-lg border border-neutral-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-700 text-gray-200">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Nombres</th>
                  <th className="p-3 text-left">Apellidos</th>
                  <th className="p-3 text-left">Fecha Resolución</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center p-4 text-gray-400 italic"
                    >
                      No hay gestiones resueltas
                    </td>
                  </tr>
                )}
                {filtradas.map((g) => (
                  <tr
                    key={g.ID}
                    className="border-t border-neutral-700 hover:bg-neutral-700/50 transition"
                  >
                    <td className="p-3 font-medium text-white">{g.ID}</td>
                    <td className="p-3">{g.Nombres}</td>
                    <td className="p-3">{g.Apellidos}</td>
                    <td className="p-3 text-gray-300">{g.FechaResolucion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
