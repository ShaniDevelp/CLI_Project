import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ successs: false, message: "No file uploaded." },{status: 400});
  }

  const mimeType = file.type; // Get the MIME type from the file itself
  if (mimeType !== "text/csv") {
    return NextResponse.json({
      success: false,
      message: "Invalid file type. Only CSV files allowed.",
    },{status: 400});
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = join(process.cwd(), "public", "uploads", file.name);
    await writeFile(path, buffer);
    return NextResponse.json({ success: true, file: file.name },{status: 200});
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      message: "Error uploading file.",
    },{status: 400});
  }
}
