import { NextResponse } from "next/server";
import getGoogleSheetsClient from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const { id, nuevoEstado } = await req.json();

    if (!id || !nuevoEstado) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID as string;

    // 🔹 Buscar la fila donde está el ID
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:A", // Columna de IDs
    });

    const rows = readRes.data.values || [];
    let rowIndex = -1;

    rows.forEach((row, i) => {
      if (row[0] === id) rowIndex = i; // Columna A tiene el ID
    });

    if (rowIndex === -1) {
      return NextResponse.json({ error: "ID no encontrado" }, { status: 404 });
    }

    const updates: any[] = [];

    // 🔹 Actualizar Estado (columna J)
    updates.push({
      range: `Sheet1!J${rowIndex + 1}`,
      values: [[nuevoEstado]],
    });

    // 🔹 Si el estado es "Resuelto", también ponemos la FechaResolucion (columna K)
    if (nuevoEstado === "Resuelto") {
      const fecha = new Date().toISOString().split("T")[0]; // ✅ solo YYYY-MM-DD
      updates.push({
        range: `Sheet1!K${rowIndex + 1}`,
        values: [[fecha]],
      });
    }

    // 🔹 Aplicar las actualizaciones
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "RAW",
        data: updates,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error actualizando gestión:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
