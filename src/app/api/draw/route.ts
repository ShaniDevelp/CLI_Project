import { NextRequest, NextResponse } from "next/server";
import { parse } from "papaparse";
import parseColumns from "@/utils/util";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET(request: NextRequest) {
  const requestURL = new URL(request.url);

  const fileName = decodeURIComponent(requestURL.searchParams.get("filename"));
  const columnsString = decodeURIComponent(requestURL.searchParams.get("columns"));
  const columns = parseColumns(columnsString);

  console.log(fileName);

  try {
    // Search for the file in Cloudinary by name
    const searchResult = await cloudinary.search
      .expression(`filename:${fileName}`)
      .execute();

    if (searchResult.total_count === 0) {
      return NextResponse.json({ success: false, error: `File not found: ${fileName}` }, { status: 404 });
    }

    const fileUrl = searchResult.resources[0].secure_url;

    // Fetch the file content from Cloudinary
    const response = await fetch(fileUrl);
    const fileContent = await response.text();

    console.log(fileContent);

    const parsedData = parse(fileContent, { header: true });
    const fileColumns = parsedData.meta.fields;
    const invalidColumns = columns.filter((col) => !fileColumns.includes(col));
    if (invalidColumns.length > 0) {
      return NextResponse.json({ success: false, error: `Columns not found in the file: ${invalidColumns.join(", ")}` }); 
    }
    // Filter data based on selected columns
    const chartData = parsedData.data.map((row: { [x: string]: string; }) => {
        const data = {};
        columns.forEach((column) => {                                      
            if (column === "Date") {
                data[column] = new Date(row[column]).toLocaleDateString();
              } else {
                const value = parseFloat(row[column]);
                if (isNaN(value)) {
                  data[column] = null;
                } else {
                  data[column] = value;
                }
              }
        }); 
        return data                
    });
    return NextResponse.json({ success: true, data: chartData }); 
    
  } catch (error) {
    return NextResponse.json({ success: false, error: `Error fetching or processing the file: ${error.message}` }, { status: 400 });
  }
}
