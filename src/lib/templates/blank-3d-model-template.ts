export const blank3dModelTemplate = {
  type: "mode",
  code: `
export const MyModel = (props: any) => (
  <jscad>
    <cuboid size={[5, 10, 5]} />
  </jscad>
)
`.trim(),
}
