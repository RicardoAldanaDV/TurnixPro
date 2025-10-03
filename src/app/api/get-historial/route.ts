import { NextResponse } from "next/server";
import getGoogleSheetsClient from "@/lib/googleSheets";

export async function GET() {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID as string;

    // Leer todas las filas
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:L", // incluye hasta FechaResolucion
    });

    const rows = res.data.values || [];
    const headers = rows[0];

    const gestiones = rows.slice(1).map((row: string[]) => {
      const obj: Record<string, string> = {};
      headers.forEach((h: string, i: number) => {
        obj[h] = row[i] || "";
      });
      return obj;
    });

    // 🔹 Filtrar solo las resueltas
    const resueltas = gestiones.filter((g) => g.Estado === "Resuelto");

    return NextResponse.json({ data: resueltas });
  } catch (err: any) {
    console.error("Error leyendo historial:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
