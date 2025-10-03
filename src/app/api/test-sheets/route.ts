import { NextResponse } from "next/server";
import { getGoogleSheetsClient } from "@/lib/googleSheets";


export async function GET() {
  try {
    const sheets = await getGoogleSheetsClient();

    const spreadsheetId = process.env.GOOGLE_SHEET_ID as string;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:K10", // 👈 ajusta si cambias nombre de la hoja
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
