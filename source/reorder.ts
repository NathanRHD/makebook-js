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

    const pagesPerGathering = config.sheetsPerGathering * config.pagesPerSheet


    switch (config.format) {
      case "quarto": {
        const catStrings: string[] = []

        for (let sheetIndex = 1; sheetIndex <= config.sheetsPerGathering; sheetIndex++) {
          // (shouldn't this include the sheet index somewhere?)
          const initialPageNumber = 1 + (pagesPerGathering * (gatheringIndex - 1)) + (config.pagesPerSheet * (sheetIndex - 1));
          console.log("INITIAL PAGE NUMBER", initialPageNumber)
          console.log("GATHERING", gatheringIndex)
          console.log("SHEET", sheetIndex)

          // @todo take into account sheet index when reordering, according to the following notes:

          // 1)   16      1     13    4     2   15    3     14
          //      -       +     -     +     +   -     +     -

          // 2)   12      5     9     8     6   11    7     10
          //      -       +     -     +     +   -     +     -

          // wonder if it's also worth noting the palindromic nature of the subtract/add sequence for each sheet?:
          // 1 2 3 4   4 3 2 1
          // - + - + | + - + - 

          // also, this north/south pattern seems significant - presumably due to nUp?:
          // 1 2 3 4   1 2 3 4
          // N N S S | N N S S

          // both/either could be useful for writing a general algorithm, rather than relying on the switch statement!

          // append a newly imposed sheet to the existing ones
          catStrings.push(`B${initialPageNumber + config.pagesPerSheet - 1} B${initialPageNumber} B${initialPageNumber + config.pagesPerSheet - 4}south B${initialPageNumber + 3}south B${initialPageNumber + 1} B${initialPageNumber + config.pagesPerSheet - 2} B${initialPageNumber + 2}south B${initialPageNumber + config.pagesPerSheet - 3}south`)
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