// parsing & validating arguments into an object, applying defaults if applicable, etc.

type Format = "folio" | "quarto" | "sexto" | "octavo" | "duodecimo"
type InputFormat = "2o" | "4to" | "6to" | "8vo" | "12mo" | Format

type NUp = "2x1" | "2x2" | "2x3" | "4x2" | "4x3"

type BaseConfig = {
  verbose: boolean              // 0 if not verbose, 1 if -v
  favourFront: boolean          // favor front for blanks; off by default
  sheetsPerGathering: number    // number of sheets per gathering
  sourceFilename?: string
}

type SectionConfig = {
  pagesPerSheet: number
  nUp: NUp                      // positions of pages onto a sheet (see includepdf documentation!)
  format: Format
}

type Arguments = Partial<BaseConfig & {
  help: boolean                 // print the help messages and end the program
  format: InputFormat
}>

export type FullConfig = BaseConfig & SectionConfig

const defaultArgs: Required<Omit<Arguments, "sourceFilename">> = {
  help: false,
  verbose: true,
  favourFront: false,
  sheetsPerGathering: 2,
  format: "quarto"
}

// define a function for dealing with signature types; convert to words; e.g., "4to" to "quarto"
const getSectionConfig = (format: InputFormat): SectionConfig => {
  if (format === "2o" || format === "folio") {
    return {
      pagesPerSheet: 4,
      nUp: "2x1",
      format: "folio"
    }
  }

  if (format === "4to" || format === "quarto") {
    return {
      pagesPerSheet: 8,
      nUp: "2x2",
      format: "quarto"
    }
  }

  if (format === "6to" || format === "sexto") {
    return {
      pagesPerSheet: 12,
      nUp: "2x3",
      format: "sexto"
    }
  }

  if (format === "8vo" || format === "octavo") {
    return {
      pagesPerSheet: 16,
      nUp: "4x2",
      format: "octavo"
    }
  }

  if (format === "12mo" || format === "duodecimo") {
    return {
      pagesPerSheet: 24,
      nUp: "4x3",
      format: "duodecimo"
    }
  }

  throw `sigType '${format}' unrecognised!`
}

export const getConfig = (): FullConfig => {
  const argsArray: string[] = process.argv;

  // parse args into options...
  // const argsObject = argsArray.reduce<Arguments>((config, arg) => {
  //   // @todo add arg to config
  //   return {
  //     ...config
  //   }
  // }, { ...defaultArgs }) as Arguments

  // if (argsObject.help) {
  //   printHelp();
  //   process.exit()
  // }

  // @todo implement actual argument parsing
  const argsObject = { ...defaultArgs }

  const sectionConfig = getSectionConfig(argsObject.format)

  // convert input sig type to system types, and favour other specific args over sig defaults or generic defaults
  return {
    ...defaultArgs,
    ...sectionConfig,
  };
}
