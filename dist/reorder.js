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
exports.reorderPages = (totalSignatures, config, getTempFilename) => __awaiter(this, void 0, void 0, function* () {
    for (let sigIndex = 1; sigIndex <= totalSignatures; sigIndex++) {
        console.log(`Rearranging section number ${sigIndex}...`);
        const blankedFile = getTempFilename(files_1.fileVersions.blankedFile);
        const reorderedFile = getTempFilename(files_1.fileVersions.reorderedFile);
        const sigFile = getTempFilename(files_1.fileVersions.sigFile(sigIndex));
        switch (config.sigType) {
            case "quarto": {
                // can't work out with this represents...
                for (let n = 1; n <= config.sectionType; n++) {
                    // can't work out what these represent...
                    const m = config.sectionType * 8 - config.sectionType * n;
                    const k = sigIndex + 4 * n;
                    // append a newly imposed signature to the existing ones
                    const catString = `B${k + m - 1} B${k} B${k + m - 4}south B${k + 3}south B${k + 1} B${k + m - 2} B${k + 2}south B${k + m - 3}south`;
                    if (sigIndex === 1 && n === 1) {
                        yield commands_1.pdftkCat(null, blankedFile, sigFile, catString);
                    }
                    else {
                        yield commands_1.pdftkCat(reorderedFile, blankedFile, sigFile, `A1-end ${catString}`);
                    }
                    yield commands_1.moveFile(sigFile, reorderedFile);
                }
            }
        }
    }
});
