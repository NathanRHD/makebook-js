import { GetTempFilename, fileVersions } from "./files";
import { pdftkCat, moveFile, copyFile } from "./commands";

export const blankPages = async (totalPages: number, pagesPerGathering: number, getTempFilename: GetTempFilename, verbose: boolean, favourFront: boolean) => {
  const sourceFilename = getTempFilename(fileVersions.sourceFile)
  const blankFilename = "static/blank.pdf"
  const blankedFilename = getTempFilename(fileVersions.blankedFile)
  const blankingFilename = getTempFilename(fileVersions.blankingFile)

  const ungatheredPages = totalPages % pagesPerGathering

  const minimumBlankPages = pagesPerGathering - ungatheredPages

  // ensure that there are at least 2 blank pages at the front to ensure the first/title page is verso
  const totalBlankPages = minimumBlankPages >= 2 ?
    minimumBlankPages
    :
    minimumBlankPages + pagesPerGathering

  let startBlankPages = favourFront ?
    Math.ceil(totalBlankPages / 2)
    :
    Math.floor(totalBlankPages / 2)

  startBlankPages = Math.max(startBlankPages, 2)

  const endBlankPages = totalBlankPages - startBlankPages

  if (verbose) { console.log(`Inserting ${startBlankPages} blank pages at the start and ${endBlankPages} at the end...`) }

  await copyFile(sourceFilename, blankedFilename);

  // @todo rather than calling cat to add one page a number of times, call cat once to add a number of pages...
  for (let startIndex = 0; startIndex < startBlankPages; startIndex++) {
    if (verbose) { console.log(`Inserting start page ${startIndex}`) }

    await pdftkCat(blankedFilename, blankFilename, blankingFilename, "B1 A1-end")

    await moveFile(
      blankingFilename,
      blankedFilename
    )
  }

  for (let endIndex = 0; endIndex < endBlankPages; endIndex++) {
    if (verbose) { console.log(`Inserting end page ${endIndex}`) }

    await pdftkCat(blankedFilename, blankFilename, blankingFilename, "A1-end B1")

    await moveFile(
      getTempFilename(fileVersions.blankingFile),
      getTempFilename(fileVersions.blankedFile)
    )
  }

  return totalBlankPages
}