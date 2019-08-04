import { OpaqueString } from "./types";

// shame this can't be a little neater...

type FileVersion = OpaqueString<"fileVersion">

export const fileVersions = {
  sourceFile: "source.pdf" as FileVersion,
  blankingFile: "blanking.pdf" as FileVersion,
  blankedFile: "blanked.pdf" as FileVersion,
  reorderedFile: "reordered.pdf" as FileVersion,
  gatheringFile: (gatheringIndex: number) => `gathering-${gatheringIndex}.pdf` as FileVersion,
  texFile: ".tex" as FileVersion
}

export type GetTempFilename = (version: FileVersion) => string

// if no version is provided, default to pdf
export const getTempFilenameFactory = (guid: string): GetTempFilename => {
  return (version?: FileVersion) => `tmp_${guid}${version !== null ? "_" + version : ".pdf"}`
}

