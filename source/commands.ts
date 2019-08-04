import { writeFile } from "fs";

// async/await wrappers for calling various shell commands

const util = require("util");
export const exec = util.promisify(require("child_process").exec);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

export const prompt = async (prompt: string) => {
  const response = await exec("pwd")

  console.log("PWD: ", response)

  return new Promise<string>((res, rej) => {
    readline.question(prompt, result => res(result))
  })
}

export const pdfLatex = async (filename: string) => {
  await exec(`pdflatex "${filename}"`)
}

export const pdftkCat = async (
  aFilename: string | null, 
  bFilename: string, 
  destinationFilename: string, 
  catString: string
) => {
  const response = await exec(`pdftk ${aFilename !== null ? `A="${aFilename}"` : ""} B="${bFilename}" cat ${catString} output "${destinationFilename}"`)
}

export const writeFileAsync = (filename: string, content: string) => {
 return new Promise((res, rej) => writeFile(filename, content, {}, (err) => {
  if (err) {
    rej(err)
  }

  else {
    res()
  }
 }))
}

export const copyFile = async (sourceFilename: string, targetFilename: string) => {
  await exec(`cp "${sourceFilename}" "${targetFilename}"`)
}

export const moveFile = async (sourceFilename: string, targetFilename: string) => {
  await exec(`mv "${sourceFilename}" "${targetFilename}"`)
}