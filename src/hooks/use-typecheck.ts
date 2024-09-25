// import * as ts from "typescript"

// export function checkTypeScriptErrors(code: string): ts.Diagnostic[] {
//   // Create a virtual TypeScript compiler
//   const compilerOptions: ts.CompilerOptions = {
//     noEmit: true,
//     allowJs: true,
//     checkJs: true,
//     strict: true,
//   }

//   // Create a virtual file system
//   const fileSystem = {
//     "example.ts": code,
//   }

//   // Create a compiler host
//   const compilerHost = ts.createCompilerHost(compilerOptions)
//   compilerHost.getSourceFile = (fileName: string) => {
//     return ts.createSourceFile(
//       fileName,
//       fileSystem[fileName] || "",
//       ts.ScriptTarget.Latest,
//     )
//   }
//   compilerHost.writeFile = () => {}
//   compilerHost.getCurrentDirectory = () => "/"
//   compilerHost.getDefaultLibFileName = () => "lib.d.ts"

//   // Create a program
//   const program = ts.createProgram(
//     ["example.ts"],
//     compilerOptions,
//     compilerHost,
//   )

//   // Get the diagnostics (errors)
//   const diagnostics = ts.getPreEmitDiagnostics(program)

//   return diagnostics
// }

// // Example usage
// const code = `
// let x: number = "string"; // Type error
// let y: string = 5; // Another type error
// let z: number = 10; // No error
// `

// const errors = checkTypeScriptErrors(code)
// console.log("Errors found:", errors.length)
// errors.forEach((error) => {
//   console.log(`Error on line ${error.start}: ${error.messageText}`)
// })
