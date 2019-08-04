import { GetTempFilename, fileVersions } from "./files";
import { pdftkCat, moveFile, copyFile } from "./commands";

export const blankPages = async (totalPages: number, pagesPerGathering: number, getTempFilename: GetTempFilename, verbose: boolean, favourFront: boolean) => {
  const sourceFilename = getTempFilename(fileVersions.sourceFile)
  const blankFilename = "static/blank.pdf"
  const blankedFilename = getTempFilename(fileVersions.blankedFile)
  const blankingFilename = getTempFilename(fileVersions.blankingFile)

  // determine if extra pages will be necessary
  let totalBlankPages = totalPages % pagesPerGathering


  // now insert blank pages as needed, preferring the back for
  // odd numbers by default, front if stated
  if (!totalBlankPages) {
    if (verbose) { console.log("Inserting one blank page...") }

    if (!favourFront) {
      // add a blank page to the end
      await pdftkCat(sourceFilename, blankFilename, blankedFilename, "A1-end B1")
    }

    else {
      // add a blank page to the start
      await pdftkCat(sourceFilename, blankFilename, blankedFilename, "B1 A1-end")
    }
  }

  else {
    let startBlankPages = favourFront ?
      Math.ceil(totalBlankPages / 2)
      :
      Math.floor(totalBlankPages / 2)

    let endBlankPages = totalBlankPages - startBlankPages

    // an odd number is needed at the front, assuming the initial (title)page is verso
    if (
      favourFront &&
      startBlankPages % 2 === 0
    ) {
      startBlankPages++
      endBlankPages++
    }

    if (verbose) { console.log(`Inserting ${startBlankPages} blank pages at the start and ${endBlankPages} at the end...`) }

    await copyFile(sourceFilename, blankedFilename);

    // @todo rather than calling cat to add one page a number of times, call cat once to add a number of pages...
    for (let startIndex = 0; startIndex < startBlankPages; startIndex++) {
      if (verbose) { console.log(`Inserting start page ${startIndex}`) }
      // add a blank page to the beginning of the blanked files content to create a new blanking file
      await pdftkCat(blankedFilename, blankFilename, blankingFilename, "B1 A1-end")

      // replace the blanked file with the blanking file
      await moveFile(
        blankingFilename,
        blankedFilename
      )  
    }

    for (let endIndex = 0; endIndex < endBlankPages; endIndex++) {
      if (verbose) { console.log(`Inserting end page ${endIndex}`) }

      // add a blank page to the end of the target file's content to create a new temp file
      await pdftkCat(blankedFilename, blankFilename, blankingFilename, "A1-end B1")

      // replace the target file with the temp
      await moveFile(
        getTempFilename(fileVersions.blankingFile),
        getTempFilename(fileVersions.blankedFile)
      )
    }
  }

  return totalBlankPages
}