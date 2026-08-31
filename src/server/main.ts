import { resolve } from "path"
import { getDirname } from "rokay/server/node"
import { getRokayServerConfig } from "rokay/server/server"

import { Chester } from "./chester.js"


Chester({
  server: getRokayServerConfig({
    port: 7024,
    staticDir: resolve(getDirname(import.meta), "..", "..", "static"),
  }),
})
