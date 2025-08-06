import { NextRequest, NextResponse } from 'next/server';
import * as Papa from 'papaparse';
import { xml2json } from 'xml-js';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const fileContent = await file.text();
  let metadata = {};

  try {
    if (file.name.endsWith('.csv')) {
      const parsedCsv = Papa.parse(fileContent, { header: true });
      metadata = {
        fileName: file.name,
        fileType: 'csv',
        rowCount: parsedCsv.data.length,
        fields: parsedCsv.meta.fields,
      };
    } else if (file.name.endsWith('.xml')) {
      const parsedXml = xml2json(fileContent, { compact: true, spaces: 2 });
      metadata = {
        fileName: file.name,
        fileType: 'xml',
        content: JSON.parse(parsedXml),
      };
    } else if (file.name.endsWith('.json')) {
      metadata = {
        fileName: file.name,
        fileType: 'json',
        content: JSON.parse(fileContent),
      };
    }

    return NextResponse.json(metadata);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 500 });
  }
}
