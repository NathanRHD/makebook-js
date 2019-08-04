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
    // determine if extra pages will be necessary
    let totalBlankPages = totalPages % pagesPerGathering;
    // now insert blank pages as needed, preferring the back for
    // odd numbers by default, front if stated
    if (!totalBlankPages) {
        if (verbose) {
            console.log("Inserting one blank page...");
        }
        if (!favourFront) {
            // add a blank page to the end
            yield commands_1.pdftkCat(sourceFilename, blankFilename, blankedFilename, "A1-end B1");
        }
        else {
            // add a blank page to the start
            yield commands_1.pdftkCat(sourceFilename, blankFilename, blankedFilename, "B1 A1-end");
        }
    }
    else {
        let startBlankPages = favourFront ?
            Math.ceil(totalBlankPages / 2)
            :
                Math.floor(totalBlankPages / 2);
        let endBlankPages = totalBlankPages - startBlankPages;
        // an odd number is needed at the front, assuming the initial (title)page is verso
        if (favourFront &&
            startBlankPages % 2 === 0) {
            startBlankPages++;
            endBlankPages++;
        }
        if (verbose) {
            console.log(`Inserting ${startBlankPages} blank pages at the start and ${endBlankPages} at the end...`);
        }
        yield commands_1.copyFile(sourceFilename, blankedFilename);
        // @todo rather than calling cat to add one page a number of times, call cat once to add a number of pages...
        for (let startIndex = 0; startIndex < startBlankPages; startIndex++) {
            if (verbose) {
                console.log(`Inserting start page ${startIndex}`);
            }
            // add a blank page to the beginning of the blanked files content to create a new blanking file
            yield commands_1.pdftkCat(blankedFilename, blankFilename, blankingFilename, "B1 A1-end");
            // replace the blanked file with the blanking file
            yield commands_1.moveFile(blankingFilename, blankedFilename);
        }
        for (let endIndex = 0; endIndex < endBlankPages; endIndex++) {
            if (verbose) {
                console.log(`Inserting end page ${endIndex}`);
            }
            // add a blank page to the end of the target file's content to create a new temp file
            yield commands_1.pdftkCat(blankedFilename, blankFilename, blankingFilename, "A1-end B1");
            // replace the target file with the temp
            yield commands_1.moveFile(getTempFilename(files_1.fileVersions.blankingFile), getTempFilename(files_1.fileVersions.blankedFile));
        }
    }
    return totalBlankPages;
});
