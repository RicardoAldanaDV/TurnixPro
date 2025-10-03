import { NextResponse } from "next/server";
import getGoogleSheetsClient from "@/lib/googleSheets";

export async function POST() {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID as string;

    // Leer todas las filas
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:L",
    });

    const rows = res.data.values || [];
    if (rows.length <= 1) {
      return NextResponse.json({ success: true, message: "Nada que limpiar" });
    }

    const headers = rows[0];
    const filtradas = rows.filter((row, idx) => {
      if (idx === 0) return true; // mantener encabezados
      const estado = row[9]; // Columna J = Estado
      return estado !== "Resuelto";
    });

    // Reescribir hoja solo con las filas filtradas
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: "Sheet1!A:L",
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: filtradas,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error limpiando historial:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
