import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file") as unknown as File;

  console.log('file', file.name)

  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded." }, { status: 400 });
  }

  const mimeType = file.type;
  if (mimeType !== "text/csv") {
    return NextResponse.json({
      success: false,
      message: "Invalid file type. Only CSV files are allowed.",
    }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a hash of the file content
    const hash = crypto.createHash('md5').update(buffer).digest('hex');

    // Check if file with the same content already exists
    const searchResult = await cloudinary.search
      .expression(`tags=${hash}`)
      .execute();

    if (searchResult.total_count > 0) {
      return NextResponse.json({
        success: false,
        message: "A file with the same content has already been uploaded.",
      }, { status: 400 });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'raw', 
          folder: 'uploads',
          public_id: file.name, // Use the original filename as the public_id
          use_filename: true, // Ensure the original filename is used
          unique_filename: true, // Allow files with the same name
          tags: [hash] // Add the hash as a tag for future checks
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const uploadedFile = uploadResult as { secure_url: string, public_id: string };

    return NextResponse.json({ 
      success: true, 
      file: file.name, 
      url: uploadedFile.secure_url 
    }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      message: "Error uploading file.",
    }, { status: 400 });
  }
}
