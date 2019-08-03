const VERSION = "0.0.0"

// print the version information and exit successfully
export const printVersion = () => {
  console.log(`makebook-js v${VERSION}

A utility for taking a normal pdf and impressing multiple pages onto single pages for printing, folding, and binding as a booklet or book.

Based on the 'makebook' shell script by Donald P. Goodman III.

This program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions; see the GNU GPL v3 for details.`)
}

// print the online help and exit successfully
export const printHelp = () => {
  printVersion();

  console.log(`- V: Prints version and license information, then exits successfully.
- h: Prints this help information, then exist successfully.
- v: Verbose output
- f: Favor front, rather than back, for blanks.
- t: Signature type
- n: Number of signatures per section.
- H: Height of the target page.
- w: Width of the target page.
- d: Horizontal delta.
- D: Vertical delta.
- m: Horizontal offset.
- M: Vertical offset.
- s: Scaling of source pages to target page.
- i: Input file.
- o: Output file.`)
}
