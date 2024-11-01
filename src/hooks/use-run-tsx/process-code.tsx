export const importManualEditsCheck = (
  code: string,
  manualEditsJson: string,
) => {
  const manualEditsImportRegex =
    /import\s+(\w+)\s+from\s+["']\.\/manual-edits\.json["']/

  const importMatch = code.match(manualEditsImportRegex)
  if (importMatch) {
    const importVariableName = importMatch[1]

    // Remove the original import (It gives module not found error)
    const codeWithoutImport = code.replace(manualEditsImportRegex, "")

    // Find the board component usage
    const boardRegex = new RegExp(
      `(<board[^>]*manualEdits={${importVariableName}}[^>]*>)`,
      "g",
    )

    // Replace the manualEdits prop with manualEditsJson
    const modifiedCode = codeWithoutImport.replace(boardRegex, (match) => {
      return match.replace(
        `manualEdits={${importVariableName}}`,
        `manualEdits={${manualEditsJson}}`,
      )
    })
    return modifiedCode
  }

  return code
}
