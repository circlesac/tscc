# @circlesac/tscc

A simple TypeScript cross-compiler (tscc) that compiles and emits both ESM and CommonJS code from your TypeScript source files.

## Usage

You can run the compiler using npx:

```bash
npx @circlesac/tscc
```

## Options

| Option                 | Description                             | Default |
| ---------------------- | --------------------------------------- | ------- |
| `--include <paths...>` | Override tsconfig.json include patterns | -       |
| `-o, --out <path>`     | Output directory                        | `dist`  |
| `--verbose`            | Enable verbose output logging           | `false` |
| `-V, --version`        | Display version information             | -       |
| `-h, --help`           | Display help information                | -       |

## Examples

Basic usage with default options:

```bash
npx @circlesac/tscc
```

Override include paths:

```bash
npx @circlesac/tscc --include src/**/*.ts test/**/*.ts
```

Set custom output directory:

```bash
npx @circlesac/tscc --out build
```
