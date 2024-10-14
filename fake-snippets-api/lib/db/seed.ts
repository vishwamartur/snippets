import type { DbClient } from "./db-client"

export const seed = (db: DbClient) => {
  db.addAccount({
    github_username: "testuser",
  })
  db.addAccount({
    github_username: "seveibar",
  })
  db.addSnippet({
    name: "testuser/my-test-board",
    unscoped_name: "my-test-board",
    owner_name: "testuser",
    code: `
import { A555Timer } from "@tsci/seveibar.a555timer"

export default () => (
  <board width="10mm" height="10mm">
    <A555Timer name="U1" />
  </board>
)`.trim(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    snippet_type: "board",
    description: "A simple board with an A555 Timer component",
  })

  // Define the @tsci/seveibar.a555timer package
  db.addSnippet({
    name: "seveibar/a555timer",
    unscoped_name: "a555timer",
    owner_name: "seveibar",
    code: `
export const A555Timer = ({ name }: { name: string }) => (
  <chip name={name} footprint="dip8" />
)
`.trim(),
    dts: `
declare module "@tsci/seveibar.a555timer" {
  export const A555Timer: ({ name }: {
    name: string;
  }) => any;
}
`.trim(),
    compiled_js: `
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.A555Timer = void 0;
const A555Timer = ({
  name
}) => /*#__PURE__*/React.createElement("chip", {
  name: name,
  footprint: "dip8"
});
exports.A555Timer = A555Timer;
    `.trim(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    snippet_type: "package",
    description: "A simple package with an A555 Timer component",
  })

  // Add a snippet that outputs a square waveform using the a555timer

  db.addSnippet({
    name: "seveibar/a555timer-square-wave",
    unscoped_name: "a555timer-square-wave",
    owner_name: "seveibar",
    code: `
import { A555Timer } from "@tsci/seveibar.a555timer"

export default () => (
  <A555Timer name="U1" />
)
`.trim(),
    dts: "export declare const MyChip: (props: {\n    name: string;\n}) => any;\n",
    compiled_js:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.MyChip = void 0;\nvar _seveibar = require("@tsci/seveibar.a555timer");\nconst MyChip = props => /*#__PURE__*/React.createElement(_seveibar.A555Timer, {\n  name: "U1"\n});\nexports.MyChip = MyChip;',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    snippet_type: "package",
    description:
      "A simple package that outputs a square waveform using the a555timer",
  })
}
