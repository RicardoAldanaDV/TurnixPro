import { NextResponse } from "next/server";
import  getGoogleSheetsClient  from "@/lib/googleSheets";

export async function GET() {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID as string;

    // Leer todas las filas
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:K", // todas las columnas
    });

    const rows = res.data.values || [];

    // Convertimos cada fila en objeto
    const headers = rows[0];
    const gestiones = rows.slice(1).map((row: string[], _idx: number) => {
      const obj: Record<string, string> = {};
      headers.forEach((h: string, i: number) => {
        obj[h] = row[i] || ""; // si está vacío -> ""
      });
      return obj;
    });

    return NextResponse.json({ data: gestiones });
  } catch (err: any) {
    console.error("Error leyendo gestiones:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
