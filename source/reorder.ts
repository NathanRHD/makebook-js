import { FullConfig } from "./config";
import { GetTempFilename, fileVersions } from "./files";
import { pdftkCat, moveFile } from "./commands";

// take pages from the temp file and reorder them into the target file:
export const reorderPages = async (
  totalGatherings: number, 
  config: FullConfig, 
  getTempFilename: GetTempFilename
) => {
  for (let gatheringIndex = 1; gatheringIndex <= totalGatherings; gatheringIndex++) {
    console.log(`Rearranging gathering number ${gatheringIndex}...`)

    const blankedFile = getTempFilename(fileVersions.blankedFile)
    const reorderedFile = getTempFilename(fileVersions.reorderedFile)
    const gatheringFile = getTempFilename(fileVersions.gatheringFile(gatheringIndex))

    switch (config.format) {
      case "quarto": {
        const catStrings: string[] = []

        for (let sheetIndex = 1; sheetIndex <= config.sheetsPerGathering; sheetIndex++) {
          // can't work out what these represent - which makes sense because I've broken it!
          const m = config.sheetsPerGathering * config.pagesPerSheet - config.sheetsPerGathering * sheetIndex
          const k = gatheringIndex + 4 * sheetIndex;

          // append a newly imposed sheet to the existing ones
          catStrings.push(`B${k + m - 1} B${k} B${k + m - 4}south B${k + 3}south B${k + 1} B${k + m - 2} B${k + 2}south B${k + m - 3}south`)
        }

        // combine multiple pdftk calls into one
        // (if the catString gets long, could this cause problems?)

        const firstCat = gatheringIndex === 1
        const finalCatString = firstCat ? catStrings.join(" ") :  `A1-end ${catStrings.join(" ")}`
        const aFilename = firstCat ? null : reorderedFile

        await pdftkCat(
          aFilename,
          blankedFile,
          gatheringFile,
          finalCatString
        )

        await moveFile(gatheringFile, reorderedFile)
      }
    }
  }
}