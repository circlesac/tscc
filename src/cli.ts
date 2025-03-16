import fs from "fs"
import { fileURLToPath } from "url"
import { Command } from "./command.js"

const packageJSON = JSON.parse(fs.readFileSync(fileURLToPath(import.meta.resolve("../package.json")), "utf-8"))

const program = new Command()
program.version(packageJSON.version)
program.parse(process.argv)
