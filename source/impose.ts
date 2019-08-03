import { GetTempFilename, fileVersions } from "./files";
import { pdfLatex, writeFile } from "./commands";
import { PageSize, getTargetPageSize } from "./pageSize";
import { FullConfig } from "./config";

export const imposePages = async (config: FullConfig, getTempFilename: GetTempFilename) => {

  const targetPageSize = await getTargetPageSize(config, getTempFilename)

  // double backslash interpreted as '\' character
  const texFilename = getTempFilename(fileVersions.texFile)

  const texTemplate = `\\documentclass{article}
  \\usepackage{ pdfpages }
  
  \\usepackage[
      paperwidth=${targetPageSize.width}pts,
      paperheight=${targetPageSize.height}pts
  ]{ geometry }
  
  \\pagestyle{empty}
  
  \\begin{document}
  \\includepdf[
      nup=4x2,
      pages=-,
      turn=false,
      columnstrict,
  ]{${getTempFilename(fileVersions.reorderedFile)}}
      
  \\end{document}`

  await writeFile(texFilename, texTemplate)

  await pdfLatex(texFilename)

  console.log("Success!")
}