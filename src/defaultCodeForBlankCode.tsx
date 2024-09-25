export const defaultCodeForBlankPage = `
export default () => (
  <board width="10mm" height="10mm">
    <resistor
      resistance="1k"
      cadModel={{
        objUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/download?pn=C2889342",
      }}
      footprint="0402"
      name="R1"
      pcbX={3}
    />
    <capacitor
      capacitance="1000pF"
      cadModel={{
        objUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/download?pn=C2889342",
      }}
      footprint="0402"
      name="C1"
      pcbX={-3}
    />
    <trace from=".R1 > .pin1" to=".C1 > .pin1" />
  </board>
)
`.trim()
