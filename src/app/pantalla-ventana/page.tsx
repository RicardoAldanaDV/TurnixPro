"use client";

import { useEffect, useState } from "react";

export default function PantallaVentanaPage() {
  const [siguiente, setSiguiente] = useState<string | null>(null);
  const [enEspera, setEnEspera] = useState<string[]>([]);

  useEffect(() => {
    const canal = new BroadcastChannel("pantalla");

    canal.onmessage = (event) => {
      const { tipo, data } = event.data;
      if (tipo === "llamar") {
        setSiguiente(data.siguiente);
        setEnEspera(data.enEspera);

        // 🔊 Voz
        const speech = new SpeechSynthesisUtterance(
          `Siguiente gestión número ${data.siguiente}`
        );
        speech.lang = "es-ES";
        window.speechSynthesis.speak(speech);
      }
    };

    return () => canal.close();
  }, []);

  return (
    <div className="bg-black text-white h-screen w-screen flex">
      {/* 📋 Lista en espera */}
      <div className="w-1/4 bg-neutral-900 p-4 border-r border-neutral-700">
        <h2 className="text-lg font-bold mb-4 text-center">En espera</h2>
        <ul className="space-y-3">
          {enEspera.length === 0 && (
            <li className="text-gray-500 text-center">No hay gestiones</li>
          )}
          {enEspera.map((id, i) => (
            <li
              key={i}
              className="p-3 bg-neutral-800 rounded text-center text-xl font-semibold tracking-wide"
            >
              {id}
            </li>
          ))}
        </ul>
      </div>

      {/* 🎯 Gestión actual */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-10">
          Siguiente gestión
        </h1>
        <p className="text-7xl md:text-9xl font-extrabold text-blue-400 drop-shadow-lg">
          {siguiente || "--"}
        </p>
      </div>
    </div>
  );
}
