"use strict";
// parsing & validating arguments into an object, applying defaults if applicable, etc.
Object.defineProperty(exports, "__esModule", { value: true });
// theres no reason for default arguments to be edited at run time
const defaultConfig = {
    verbose: true,
    favourFront: false,
    help: false,
    sectionType: 1,
    pagesPerSig: 8,
    nUp: "2x2",
    sigType: "quarto"
};
// define a function for dealing with signature types; convert to words; e.g., "4to" to "quarto"
const getSectionConfig = (argsObject) => {
    if (argsObject.sigType === "2o" || argsObject.sigType === "folio") {
        return {
            pagesPerSig: 4,
            nUp: "2x1",
            sigType: "folio"
        };
    }
    if (argsObject.sigType === "4to" || argsObject.sigType === "quarto") {
        return {
            pagesPerSig: 8,
            nUp: "2x2",
            sigType: "quarto"
        };
    }
    if (argsObject.sigType === "6to" || argsObject.sigType === "sexto") {
        return {
            pagesPerSig: 12,
            nUp: "2x3",
            sigType: "sexto"
        };
    }
    if (argsObject.sigType === "8vo" || argsObject.sigType === "octavo") {
        return {
            pagesPerSig: 16,
            nUp: "4x2",
            sigType: "octavo"
        };
    }
    if (argsObject.sigType === "12mo" || argsObject.sigType === "duodecimo") {
        return {
            pagesPerSig: 24,
            nUp: "4x3",
            sigType: "duodecimo"
        };
    }
    throw `sigType '${argsObject.sigType}' unrecognised!`;
};
exports.getConfig = () => {
    const argsArray = process.argv;
    // parse args into options...
    // const argsObject = argsArray.reduce<Arguments>((config, arg) => {
    //   // @todo add arg to config
    //   return {
    //     ...config
    //   }
    // }, { }) as Arguments
    const sectionConfig = getSectionConfig(defaultConfig);
    // convert input sig type to system types, and favour other specific args over sig defaults or generic defaults
    return Object.assign({}, defaultConfig, sectionConfig);
};
