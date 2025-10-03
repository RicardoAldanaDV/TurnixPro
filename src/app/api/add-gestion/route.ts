import { NextResponse } from "next/server";
import getGoogleSheets from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const sheets = await getGoogleSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID as string;

    // 1️⃣ Leer todas las filas para calcular el siguiente ID
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:A", // solo la columna de IDs
    });

    const rows = readRes.data.values || [];
    const lastId = rows.length > 1 ? rows[rows.length - 1][0] : "A000";

    // 2️⃣ Generar nuevo ID incremental
    const newIdNum = parseInt(lastId.substring(1)) + 1;
    const newId = "A" + newIdNum.toString().padStart(3, "0");

    // 3️⃣ Generar fecha actual
    const fechaRegistro = new Date().toISOString().split("T")[0];

    // 4️⃣ Guardar en Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:K", // columnas A → K (11 columnas)
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          newId,
          body.nombres || "",
          body.apellidos || "",
          body.genero || "",
          body.fechaNacimiento || "",
          body.nombrePadre || "",
          body.nombreMadre || "",
          body.lugarNacimiento || "",
          body.comentarios || "",
          "Pendiente", // estado inicial
          fechaRegistro,
        ]],
      },
    });

    return NextResponse.json({ ok: true, id: newId });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
