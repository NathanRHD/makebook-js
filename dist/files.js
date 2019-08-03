"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileVersions = {
    sourceFile: "source",
    blankingFile: "blanking",
    blankedFile: "blanked",
    reorderedFile: "reordered",
    sigFile: (sigIndex) => `sig-${sigIndex}`,
    texFile: "tex"
};
exports.getTempFilenameFactory = (guid) => {
    return (version) => `tmp_${guid}${version !== null ? "_" + version : ""}.pdf`;
};
