import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function DELETE(request: NextRequest) {
  const requestURL = new URL(request.url);
  const filename = decodeURIComponent(requestURL.searchParams.get("filename"));

  try {
    // Search for the file in Cloudinary by name
    const searchResult = await cloudinary.search
      .expression(`filename:${filename}`)
      .execute();

    if (searchResult.total_count === 0) {
      return NextResponse.json({ success: false, message: "File not found." }, { status: 404 });
    }

    const publicId = searchResult.resources[0].public_id;

    // Delete the file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

    if (result.result === 'ok') {
      return NextResponse.json({ success: true, message: `File ${filename} has been deleted successfully.` }, { status: 200 });
    } else {
      throw new Error('Failed to delete file from Cloudinary');
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: `An error occurred while deleting the file. ${error.message}` }, { status: 400 });
  }
}