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
// take pages from the temp file and reorder them into the target file:
exports.reorderPages = (totalGatherings, config, getTempFilename) => __awaiter(this, void 0, void 0, function* () {
    for (let gatheringIndex = 1; gatheringIndex <= totalGatherings; gatheringIndex++) {
        console.log(`Rearranging gathering number ${gatheringIndex}...`);
        const blankedFile = getTempFilename(files_1.fileVersions.blankedFile);
        const reorderedFile = getTempFilename(files_1.fileVersions.reorderedFile);
        const gatheringFile = getTempFilename(files_1.fileVersions.gatheringFile(gatheringIndex));
        const pagesPerGathering = config.sheetsPerGathering * config.pagesPerSheet;
        switch (config.format) {
            case "quarto": {
                const catStrings = [];
                for (let sheetIndex = 1; sheetIndex <= config.sheetsPerGathering; sheetIndex++) {
                    // (shouldn't this include the sheet index somewhere?)
                    const initialPageNumber = 1 + (pagesPerGathering * (gatheringIndex - 1)) + (config.pagesPerSheet * (sheetIndex - 1));
                    console.log("INITIAL PAGE NUMBER", initialPageNumber);
                    console.log("GATHERING", gatheringIndex);
                    console.log("SHEET", sheetIndex);
                    // append a newly imposed sheet to the existing ones
                    catStrings.push(`B${initialPageNumber + config.pagesPerSheet - 1} B${initialPageNumber} B${initialPageNumber + config.pagesPerSheet - 4}south B${initialPageNumber + 3}south B${initialPageNumber + 1} B${initialPageNumber + config.pagesPerSheet - 2} B${initialPageNumber + 2}south B${initialPageNumber + config.pagesPerSheet - 3}south`);
                }
                // combine multiple pdftk calls into one
                // (if the catString gets long, could this cause problems?)
                const firstCat = gatheringIndex === 1;
                const finalCatString = firstCat ? catStrings.join(" ") : `A1-end ${catStrings.join(" ")}`;
                const aFilename = firstCat ? null : reorderedFile;
                yield commands_1.pdftkCat(aFilename, blankedFile, gatheringFile, finalCatString);
                yield commands_1.moveFile(gatheringFile, reorderedFile);
            }
        }
    }
});
