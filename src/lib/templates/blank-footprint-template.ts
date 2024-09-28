export const blankFootprintTemplate = `
export const MyFootprint = (props: any) => (
  <footprint>
    <smtpad shape="rect" width="0.5mm" height="0.5mm" pcbX={-1} pcbY={0} portHints={["1"]} />
    <smtpad shape="rect" width="0.5mm" height="0.5mm" pcbX={1} pcbY={0} portHints={["2"]} />
  </footprint>
)
`.trim()
