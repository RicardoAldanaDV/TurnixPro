"use client";

import * as Dialog from "@radix-ui/react-dialog";

interface GestionModalProps {
  id: string;
  nombre: string;
  onAtender: () => void;   // 👈 nueva prop
}

export default function GestionModal({ id, nombre, onAtender }: GestionModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Abrir para llamar
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">
            Detalles de la gestión
          </Dialog.Title>

          <p><span className="font-bold">Número:</span> {id}</p>
          <p><span className="font-bold">Nombre:</span> {nombre}</p>

          <div className="flex justify-end gap-3 mt-6">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">
                Cerrar
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                onClick={onAtender}   // 👈 llama a la función al atender
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
              >
                Marcar como atendido
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
