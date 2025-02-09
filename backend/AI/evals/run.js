import 'dotenv/config'
import { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname } from 'path'
import { readdir } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/* 
- If $1 then run all .eval scripts
- Else run the script with the appropriate eval names
*/

const main = async () => {
  const evalName = process.argv[2]
  const experimentsDir = join(__dirname, 'experiments')

  try {
    if (evalName) {
      //* Create a path for the script
      const evalPath = pathToFileURL(
        join(experimentsDir, `${evalName}.eval.js`)
      ).href
      //* Import and run the script
      await import(evalPath)
    } else {
      const files = await readdir(experimentsDir)
      const evalFiles = files.filter((file) => file.endsWith('.eval.js'))

      for (const evalFile of evalFiles) {
        const evalPath = pathToFileURL(join(experimentsDir, evalFile)).href
        console.log(evalPath)
        await import(evalPath)
      }
    }
  } catch (error) {
    console.error(
      `Failed to run eval${evalName ? ` '${evalName}'` : 's'}:`,
      error
    )
    process.exit(1)
  }
}

main()
