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
const pdfInfo_1 = require("./pdfInfo");
exports.getTargetPageSize = (config, getTempFilename) => __awaiter(this, void 0, void 0, function* () {
    const tempSourceFilename = getTempFilename(files_1.fileVersions.sourceFile);
    const sourcePdfInfo = yield pdfInfo_1.pdfInfo(tempSourceFilename);
    switch (config.format) {
        case "quarto": {
            return {
                height: sourcePdfInfo.pageHeight * 2,
                width: sourcePdfInfo.pageWidth * 2
            };
        }
    }
});
