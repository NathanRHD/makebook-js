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
exports.blankPages = (totalPages, pagesPerGathering, getTempFilename, verbose, favourFront) => __awaiter(this, void 0, void 0, function* () {
    const sourceFilename = getTempFilename(files_1.fileVersions.sourceFile);
    const blankFilename = "static/blank.pdf";
    const blankedFilename = getTempFilename(files_1.fileVersions.blankedFile);
    const blankingFilename = getTempFilename(files_1.fileVersions.blankingFile);
    const ungatheredPages = totalPages % pagesPerGathering;
    const minimumBlankPages = pagesPerGathering - ungatheredPages;
    // ensure that there are at least 2 blank pages at the front to ensure the first/title page is verso
    const totalBlankPages = minimumBlankPages >= 2 ?
        minimumBlankPages
        :
            minimumBlankPages + pagesPerGathering;
    let startBlankPages = favourFront ?
        Math.ceil(totalBlankPages / 2)
        :
            Math.floor(totalBlankPages / 2);
    startBlankPages = Math.max(startBlankPages, 2);
    const endBlankPages = totalBlankPages - startBlankPages;
    if (verbose) {
        console.log(`Inserting ${startBlankPages} blank pages at the start and ${endBlankPages} at the end...`);
    }
    yield commands_1.copyFile(sourceFilename, blankedFilename);
    // @todo rather than calling cat to add one page a number of times, call cat once to add a number of pages...
    for (let startIndex = 0; startIndex < startBlankPages; startIndex++) {
        if (verbose) {
            console.log(`Inserting start page ${startIndex}`);
        }
        yield commands_1.pdftkCat(blankedFilename, blankFilename, blankingFilename, "B1 A1-end");
        yield commands_1.moveFile(blankingFilename, blankedFilename);
    }
    for (let endIndex = 0; endIndex < endBlankPages; endIndex++) {
        if (verbose) {
            console.log(`Inserting end page ${endIndex}`);
        }
        yield commands_1.pdftkCat(blankedFilename, blankFilename, blankingFilename, "A1-end B1");
        yield commands_1.moveFile(getTempFilename(files_1.fileVersions.blankingFile), getTempFilename(files_1.fileVersions.blankedFile));
    }
    return totalBlankPages;
});
