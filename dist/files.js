"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileVersions = {
    sourceFile: "source.pdf",
    blankingFile: "blanking.pdf",
    blankedFile: "blanked.pdf",
    reorderedFile: "reordered.pdf",
    gatheringFile: (gatheringIndex) => `gathering-${gatheringIndex}.pdf`,
    texFile: ".tex"
};
// if no version is provided, default to pdf
exports.getTempFilenameFactory = (guid) => {
    return (version) => `tmp_${guid}${version !== null ? "_" + version : ".pdf"}`;
};
