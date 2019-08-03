import { ValueOf, OpaqueString } from "./types";
import { writeFile, pdfLatex, copyFile, moveFile, pdftkCat, prompt } from "./commands";
import { getConfig, FullConfig } from "./config";
import { printHelp, printVersion } from "./info";
import { blankPages } from "./blank";
import { reorderPages } from "./reorder";
import { getTargetPageSize } from "./pageSize";
import { imposePages } from "./impose";
import { pdfInfo } from "./pdfInfo";

type FileVersion = OpaqueString<"fileVersion">

const fileVersions = {
  sourceFile: "source" as FileVersion,
  blankingFile: "blanking" as FileVersion,
  blankedFile: "blanked" as FileVersion,
  reorderedFile: "reordered" as FileVersion,
  sigFile: (sigIndex: number) => `sig-${sigIndex}` as FileVersion,
  texFile: "tex" as FileVersion
}

type GetTempFilename = (version: FileVersion) => string

const getTempFilenameFactory = (guid: string): GetTempFilename => {
  return (version: FileVersion) => `tmp_${guid}${version !== null ? "_" + version : ""}.pdf`
}

const init = async () => {
  const guid = new Date().valueOf();
  const getTempFilename = getTempFilenameFactory(guid + "")

  const config = getConfig();

  if (config.help) {
    printHelp();
    return
  }

  if (config.verbose) {
    printVersion()
  }

  const sourceFilename = config.sourceFilename ||
    await prompt("Source Filename:")

  const tempSourceFilename = getTempFilename(fileVersions.sourceFile)

  await copyFile(sourceFilename, tempSourceFilename)

  // get some information about our source document
  // @todo implement
  const sourcePdfInfo = await pdfInfo(tempSourceFilename)

  // find the number of pages we'll have per signature
  const pagesPerSig = config.pagesPerSig * config.sectionType

  const totalBlankPages = await blankPages(sourcePdfInfo.totalPages, pagesPerSig, getTempFilename, config.verbose, config.favourFront);

  const totalSignatures = (sourcePdfInfo.totalPages + totalBlankPages) / pagesPerSig

  await reorderPages(totalSignatures, config, getTempFilename)

  await imposePages(config, getTempFilename)
}

init()