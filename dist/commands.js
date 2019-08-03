"use strict";
// async/await wrappers for calling various shell commands
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
exports.exec = util.promisify(require("child_process").exec);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
exports.prompt = (prompt) => __awaiter(this, void 0, void 0, function* () {
    const response = yield exports.exec("pwd");
    console.log("PWD: ", response);
    return new Promise((res, rej) => {
        readline.question(prompt, result => res(result));
    });
});
exports.pdfLatex = (filename) => __awaiter(this, void 0, void 0, function* () {
    yield exports.exec(`pdflatex "${filename}"`);
});
exports.pdftkCat = (aFilename, bFilename, destinationFilename, catString) => __awaiter(this, void 0, void 0, function* () {
    const response = yield exports.exec(`pdftk ${aFilename !== null ? `A="${aFilename}"` : ""} B="${bFilename}" cat ${catString} output ${destinationFilename}`);
});
exports.writeFile = (filename, content) => __awaiter(this, void 0, void 0, function* () {
    // not sure how to do this...
});
exports.copyFile = (sourceFilename, targetFilename) => __awaiter(this, void 0, void 0, function* () {
    yield exports.exec(`cp "${sourceFilename}" "${targetFilename}"`);
});
exports.moveFile = (sourceFilename, targetFilename) => __awaiter(this, void 0, void 0, function* () {
    yield exports.exec(`mv "${sourceFilename}" "${targetFilename}"`);
});
