import { FullConfig } from "./config";
import { fileVersions, GetTempFilename } from "./files";
import { pdfInfo } from "./pdfInfo";

export interface PageSize {
  height: number
  width: number
}

export const getTargetPageSize = async (config: FullConfig, getTempFilename: GetTempFilename): Promise<PageSize> => {
  const tempSourceFilename = getTempFilename(fileVersions.sourceFile)
  const sourcePdfInfo = await pdfInfo(tempSourceFilename)

  switch (config.format) {
    case "quarto": {
      return {
        height: sourcePdfInfo.pageHeight * 2,
        width: sourcePdfInfo.pageWidth * 2
      }
    }
  }
}