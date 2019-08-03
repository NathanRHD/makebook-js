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
// taken from here: https://github.com/howtomakeaturn/pdfinfo/blob/master/src/Howtomakeaturn/PDFInfo/PDFInfo.php
const pdfInfoParseValue = (stdout, attribute) => {
    return stdout.match(new RegExp(`${attribute}:.*`))[0].split(":")[1].trim();
};
exports.pdfInfo = (filename) => __awaiter(this, void 0, void 0, function* () {
    const response = yield commands_1.exec(`pdfinfo "${filename}"`);
    const pageSize = pdfInfoParseValue(response.stdout, "Page size")
        .replace("pts", "")
        .split("x");
    const info = {
        totalPages: Number(pdfInfoParseValue(response.stdout, "Pages")),
        pageWidth: Number(pageSize[0]),
        pageHeight: Number(pageSize[1])
    };
    console.log("PARSED INFO", JSON.stringify(info));
    return info;
});
