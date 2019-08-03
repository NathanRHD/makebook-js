import { OpaqueString } from "./types";

// shame this can't be a little neater...

type FileVersion = OpaqueString<"fileVersion">

export const fileVersions = {
  sourceFile: "source" as FileVersion,
  blankingFile: "blanking" as FileVersion,
  blankedFile: "blanked" as FileVersion,
  reorderedFile: "reordered" as FileVersion,
  sigFile: (sigIndex: number) => `sig-${sigIndex}` as FileVersion,
  texFile: "tex" as FileVersion
}

export type GetTempFilename = (version: FileVersion) => string

export const getTempFilenameFactory = (guid: string): GetTempFilename => {
  return (version: FileVersion) => `tmp_${guid}${version !== null ? "_" + version : ""}.pdf`
}

