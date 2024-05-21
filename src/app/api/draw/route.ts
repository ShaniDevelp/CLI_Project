import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { parse } from "papaparse";
import parseColumns from "@/utils/util";

export async function GET(request: NextRequest) {
  const requestURL = new URL(request.url);

   const filename = decodeURIComponent(requestURL.searchParams.get("filename"));
   const columnsString = decodeURIComponent(requestURL.searchParams.get("columns"));
   const columns = parseColumns(columnsString);

  try {
    const filePath = join(process.cwd(), "public", "uploads", `${filename}`);
    const fileContent = await readFile(filePath, "utf-8");
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
    return NextResponse.json({ success: false, error: `${filename} not found in the uploads directory` },{status: 400});
  }
}
