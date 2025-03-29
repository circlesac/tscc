import path from "path"
import { TransformOptions, transformFileAsync } from "@babel/core"
import addImportExtension from "babel-plugin-add-import-extension"
import * as commander from "commander"
import fs from "fs/promises"
import { glob } from "glob"
import ts, { CompilerOptions } from "typescript"

interface Options {
	include: string[]
	out: string
	verbose: boolean
}

export class Command extends commander.Command {
	private context: ts.ParsedCommandLine = {
		options: {},
		fileNames: [],
		errors: []
	}
	private verbose = false

	constructor() {
		super()
		this.option("--include <paths...>", "Override tsconfig.json include")
		this.option("-o, --out <path>", "Output directory", "dist")
		this.option("--verbose", "Verbose output")
		this.action(async (options: Options) => {
			this.verbose = options.verbose

			await this.run(options)
		})
	}

	async run(options: Options) {
		const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile)

		// override include
		if (options.include) config.config.include = options.include

		this.context = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(path.resolve("tsconfig.json")))

		await Promise.all([
			this.compile({
				module: ts.ModuleKind.CommonJS,
				target: ts.ScriptTarget.ES2015, // ES6
				outDir: `${options.out}/cjs`
			}),
			this.compile({
				module: ts.ModuleKind.ES2022,
				target: ts.ScriptTarget.ES2015, // ES6
				outDir: `${options.out}/esm`
			})
		])

		await this.transform(`${options.out}/esm`)
	}

	private async log(...messages: unknown[]) {
		if (this.verbose) console.info(messages)
	}

	async compile(override: Partial<CompilerOptions>) {
		const options: CompilerOptions = {
			...this.context.options,
			...override,
			declaration: true,
			declarationMap: true
		}

		// tsc
		this.log("[compile] createProgramOptions=", this.context)
		const program = ts.createProgram(this.context.fileNames, options)

		const emitResult = program.emit()
		this.log("[compile]", emitResult)
	}

	async transform(outDir: string) {
		const options: TransformOptions = {
			plugins: [addImportExtension]
		}

		const files = await glob("**/*.js", { cwd: outDir })
		await Promise.all(
			files.map(async (file) => {
				this.log("[transform]", path.join(outDir, file))
				const result = await transformFileAsync(path.join(outDir, file), options)
				await fs.writeFile(path.join(outDir, file), result?.code ?? "")
			})
		)
	}
}
