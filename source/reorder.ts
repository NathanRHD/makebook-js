import { FullConfig } from "./config";
import { GetTempFilename, fileVersions } from "./files";
import { pdftkCat, moveFile } from "./commands";

// take pages from the temp file and reorder them into the target file:
export const reorderPages = async (
  totalSignatures: number, 
  config: FullConfig, 
  getTempFilename: GetTempFilename
) => {
  for (let sigIndex = 1; sigIndex <= totalSignatures; sigIndex++) {
    console.log(`Rearranging section number ${sigIndex}...`)

    const blankedFile = getTempFilename(fileVersions.blankedFile)
    const reorderedFile = getTempFilename(fileVersions.reorderedFile)
    const sigFile = getTempFilename(fileVersions.sigFile(sigIndex))

    switch (config.sigType) {
      case "quarto": {
        // !! @TODO THERE IS SOMETHING VERY WRONG HERE !!

        // can't work out with this represents...
        for (let n = 1; n <= config.sectionType; n++) {
          // can't work out what these represent...
          const m = config.sectionType * 8 - config.sectionType * n
          const k = sigIndex + 4 * n;

          // append a newly imposed signature to the existing ones

          const catString = `B${k + m - 1} B${k} B${k + m - 4}south B${k + 3}south B${k + 1} B${k + m - 2} B${k + 2}south B${k + m - 3}south`

          if (sigIndex === 1 && n === 1) {
            await pdftkCat(
              null, 
              blankedFile, 
              sigFile,
              catString
            )
          }

          else {
            await pdftkCat(
              reorderedFile, 
              blankedFile, 
              sigFile,
              `A1-end ${catString}`
            )
          }

          await moveFile(sigFile, reorderedFile)
        }
      }
    }
  }
}