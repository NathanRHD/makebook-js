import { GetTempFilename, fileVersions } from "./files";
import { pdfLatex, writeFileAsync } from "./commands";
import { getTargetPageSize } from "./pageSize";
import { FullConfig } from "./config";

export const imposePages = async (config: FullConfig, getTempFilename: GetTempFilename) => {

  const targetPageSize = await getTargetPageSize(config, getTempFilename)

  // double backslash interpreted as '\' character
  const texFilename = getTempFilename(fileVersions.texFile)

  const texTemplate = `\\documentclass{article}
  \\usepackage{ pdfpages }
  
  \\usepackage[
      paperwidth=${targetPageSize.width}pt,
      paperheight=${targetPageSize.height}pt
  ]{ geometry }
  
  \\pagestyle{empty}
  
  \\begin{document}
  \\includepdf[
      nup=${config.nUp},
      pages=-,
      turn=false,
      columnstrict,
  ]{${getTempFilename(fileVersions.reorderedFile)}}
      
  \\end{document}`

  await writeFileAsync(texFilename, texTemplate)

  await pdfLatex(texFilename)

  console.log("Success!")

  process.exit()
}