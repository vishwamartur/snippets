export const blankPackageTemplate = `
export const MyChip = (props: { name: string }) => (
  <chip
    {...props}
    cadModel={{
      objUrl:
        "https://modelcdn.tscircuit.com/easyeda_models/download?pn=C2889342",
    }}
    footprint="soic8"
  />
)
`.trim()
