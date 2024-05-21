import { unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function DELETE(request: NextRequest) {
  const requestURL = new URL(request.url);
  const filename = decodeURIComponent(requestURL.searchParams.get("filename"))
 
  try {
    const filePath = join(process.cwd(), 'public', 'uploads', `${filename}`);
    if (!filePath) {
      return NextResponse.json({ successs: false, message: "file not found." },{status: 400});
    }
    await unlink(filePath);
    return NextResponse.json({success: true, message: `File ${filename} has been deleted successfully.`},{status: 200});
  } catch (error) {
    return NextResponse.json({success: false, error: `An error occurred while deleting the file. ${error}`},{status: 400});
  }
}