"use client";

import { useState } from "react";

export default function NuevoRegistroPage() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    genero: "",
    fechaNacimiento: "",
    nombrePadre: "",
    nombreMadre: "",
    lugarNacimiento: "",
    comentarios: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/add-gestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar el registro");

      setMessage("✅ Registro guardado con éxito");
      setFormData({
        nombres: "",
        apellidos: "",
        genero: "",
        fechaNacimiento: "",
        nombrePadre: "",
        nombreMadre: "",
        lugarNacimiento: "",
        comentarios: "",
      });
    } catch (error: any) {
      console.error(error);
      setMessage("❌ Error al guardar el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-neutral-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Nuevo Registro de Gestión</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700"
      >
        {/* Nombres */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Nombres</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Apellidos */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Género */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccionar</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Padre */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Nombre del padre
          </label>
          <input
            type="text"
            name="nombrePadre"
            value={formData.nombrePadre}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Madre */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Nombre de la madre
          </label>
          <input
            type="text"
            name="nombreMadre"
            value={formData.nombreMadre}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lugar */}
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-300 mb-1">
            Lugar de nacimiento
          </label>
          <input
            type="text"
            name="lugarNacimiento"
            value={formData.lugarNacimiento}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Comentarios */}
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-300 mb-1">Comentarios</label>
          <textarea
            name="comentarios"
            value={formData.comentarios}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded font-semibold shadow-md"
        >
          {loading ? "Guardando..." : "Guardar Registro"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.startsWith("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
