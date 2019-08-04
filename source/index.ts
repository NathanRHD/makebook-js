import { OpaqueString } from "./types";
import { copyFile, prompt } from "./commands";
import { getConfig } from "./config";
import { printVersion } from "./info";
import { blankPages } from "./blank";
import { reorderPages } from "./reorder";
import { imposePages } from "./impose";
import { pdfInfo } from "./pdfInfo";
import { getTempFilenameFactory, fileVersions } from "./files";

const init = async () => {
  const guid = new Date().valueOf();
  const getTempFilename = getTempFilenameFactory(guid + "")

  const config = getConfig();

  if (config.verbose) {
    printVersion()
  }

  const sourceFilename = config.sourceFilename ||
    await prompt("Source Filename: $")

  const tempSourceFilename = getTempFilename(fileVersions.sourceFile)

  await copyFile(sourceFilename, tempSourceFilename)

  // get some information about our source document
  const sourcePdfInfo = await pdfInfo(tempSourceFilename)

  // find the number of pages we'll have per signature
  const pagesPerGathering = config.pagesPerSheet * config.sheetsPerGathering

  const totalBlankPages = await blankPages(sourcePdfInfo.totalPages, pagesPerGathering, getTempFilename, config.verbose, config.favourFront);

  const totalGatherings = (sourcePdfInfo.totalPages + totalBlankPages) / pagesPerGathering

  await reorderPages(totalGatherings, config, getTempFilename)

  await imposePages(config, getTempFilename)
}

init()