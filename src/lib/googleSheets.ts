import { google } from "googleapis";

export default async function getGoogleSheets() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Faltan variables de entorno para Google Sheets");
  }

  // 🔑 Corregimos la clave privada
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY as string).replace(/\\n/g, "\n");

  // ✅ Inicializar JWT correctamente
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}
