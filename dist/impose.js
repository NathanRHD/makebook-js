"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const files_1 = require("./files");
const commands_1 = require("./commands");
const pageSize_1 = require("./pageSize");
exports.imposePages = (config, getTempFilename) => __awaiter(this, void 0, void 0, function* () {
    const targetPageSize = yield pageSize_1.getTargetPageSize(config, getTempFilename);
    // double backslash interpreted as '\' character
    const texFilename = getTempFilename(files_1.fileVersions.texFile);
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
  ]{${getTempFilename(files_1.fileVersions.reorderedFile)}}
      
  \\end{document}`;
    yield commands_1.writeFileAsync(texFilename, texTemplate);
    yield commands_1.pdfLatex(texFilename);
    console.log("Success!");
    process.exit();
});
