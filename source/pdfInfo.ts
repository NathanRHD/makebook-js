import { exec } from "./commands";

export interface PdfInfo {
  totalPages: number
  pageHeight: number
  pageWidth: number
}

// taken from here: https://github.com/howtomakeaturn/pdfinfo/blob/master/src/Howtomakeaturn/PDFInfo/PDFInfo.php
const pdfInfoParseValue = (stdout: string, attribute: string) => {
  return stdout.match(new RegExp(`${attribute}:.*`))[0].split(":")[1].trim()
}

export const pdfInfo = async (filename: string): Promise<PdfInfo> => {
  const response: { stdout: string } = await exec(`pdfinfo "${filename}"`)

  const pageSize = pdfInfoParseValue(response.stdout, "Page size")
    .replace("pts", "")
    .split("x");

  const info = {
    totalPages: Number(pdfInfoParseValue(response.stdout, "Pages")),
    pageWidth: Number(pageSize[0]),
    pageHeight: Number(pageSize[1])
  }

  console.log("PARSED INFO", JSON.stringify(info))

  return info
}