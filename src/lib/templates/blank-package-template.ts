export const blankPackageTemplate = {
  type: "package",
  code: `
export const MyChip = (props: { name: string }) => (
  <chip
    {...props}
    footprint="soic8"
  />
)
`.trim(),
};
