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
const commands_1 = require("./commands");
const config_1 = require("./config");
const info_1 = require("./info");
const blank_1 = require("./blank");
const reorder_1 = require("./reorder");
const impose_1 = require("./impose");
const pdfInfo_1 = require("./pdfInfo");
const files_1 = require("./files");
const init = () => __awaiter(this, void 0, void 0, function* () {
    const guid = new Date().valueOf();
    const getTempFilename = files_1.getTempFilenameFactory(guid + "");
    const config = config_1.getConfig();
    if (config.verbose) {
        info_1.printVersion();
    }
    const sourceFilename = config.sourceFilename ||
        (yield commands_1.prompt("Source Filename: $"));
    const tempSourceFilename = getTempFilename(files_1.fileVersions.sourceFile);
    yield commands_1.copyFile(sourceFilename, tempSourceFilename);
    // get some information about our source document
    const sourcePdfInfo = yield pdfInfo_1.pdfInfo(tempSourceFilename);
    // find the number of pages we'll have per signature
    const pagesPerGathering = config.pagesPerSheet * config.sheetsPerGathering;
    const totalBlankPages = yield blank_1.blankPages(sourcePdfInfo.totalPages, pagesPerGathering, getTempFilename, config.verbose, config.favourFront);
    const totalGatherings = (sourcePdfInfo.totalPages + totalBlankPages) / pagesPerGathering;
    yield reorder_1.reorderPages(totalGatherings, config, getTempFilename);
    yield impose_1.imposePages(config, getTempFilename);
});
init();
