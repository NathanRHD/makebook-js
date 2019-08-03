// parsing & validating arguments into an object, applying defaults if applicable, etc.

type SigType = "folio" | "quarto" | "sexto" | "octavo" | "duodecimo"
type InputSigType = "2o" | "4to" | "6to" | "8vo" | "12mo" | SigType

type NUp = "2x1" | "2x2" | "2x3" | "4x2" | "4x3"

type BaseConfig = {
  verbose: boolean              // 0 if not verbose, 1 if -v
  favourFront: boolean          // favor front for blanks; off by default
  help: boolean                 // print the help messages and end the program
  sectionType: number           // number of signatures per section
  sourceFilename?: string
}

type SectionConfig = {
  pagesPerSig: number
  nUp: NUp
  sigType: SigType
}

// The exclusion seems to be being ignored in my intellisense...
type Arguments = Partial<BaseConfig & {
  sigType: InputSigType
}>

export type FullConfig = BaseConfig & SectionConfig

// theres no reason for default arguments to be edited at run time
const defaultConfig: Readonly<FullConfig> = {
  verbose: true,
  favourFront: false,
  help: false,
  sectionType: 1,
  pagesPerSig: 8,
  nUp: "2x2",
  sigType: "quarto"
}

// define a function for dealing with signature types; convert to words; e.g., "4to" to "quarto"
const getSectionConfig = (argsObject: Arguments): SectionConfig => {
  if (argsObject.sigType === "2o" || argsObject.sigType === "folio") {
    return {
      pagesPerSig: 4,
      nUp: "2x1",
      sigType: "folio"
    }
  }

  if (argsObject.sigType === "4to" || argsObject.sigType === "quarto") {
    return {
      pagesPerSig: 8,
      nUp: "2x2",
      sigType: "quarto"
    }
  }

  if (argsObject.sigType === "6to" || argsObject.sigType === "sexto") {
    return {
      pagesPerSig: 12,
      nUp: "2x3",
      sigType: "sexto"
    }
  }

  if (argsObject.sigType === "8vo" || argsObject.sigType === "octavo") {
    return {
      pagesPerSig: 16,
      nUp: "4x2",
      sigType: "octavo"
    }
  }

  if (argsObject.sigType === "12mo" || argsObject.sigType === "duodecimo") {
    return {
      pagesPerSig: 24,
      nUp: "4x3",
      sigType: "duodecimo"
    }
  }

  throw `sigType '${argsObject.sigType}' unrecognised!`
}

export const getConfig = (): FullConfig => {
  const argsArray: string[] = process.argv;

  // parse args into options...
  // const argsObject = argsArray.reduce<Arguments>((config, arg) => {
  //   // @todo add arg to config
  //   return {
  //     ...config
  //   }
  // }, { }) as Arguments

  const sectionConfig = getSectionConfig(defaultConfig)

  // convert input sig type to system types, and favour other specific args over sig defaults or generic defaults
  return {
    ...defaultConfig,
    ...sectionConfig,
  };
}
