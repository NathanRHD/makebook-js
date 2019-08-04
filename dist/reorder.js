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
        switch (config.format) {
            case "quarto": {
                const catStrings = [];
                for (let sheetIndex = 1; sheetIndex <= config.sheetsPerGathering; sheetIndex++) {
                    // can't work out what these represent - which makes sense because I've broken it!
                    const m = config.sheetsPerGathering * config.pagesPerSheet - config.sheetsPerGathering * sheetIndex;
                    const k = gatheringIndex + 4 * sheetIndex;
                    // append a newly imposed sheet to the existing ones
                    catStrings.push(`B${k + m - 1} B${k} B${k + m - 4}south B${k + 3}south B${k + 1} B${k + m - 2} B${k + 2}south B${k + m - 3}south`);
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
