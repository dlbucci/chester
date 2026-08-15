import { resolve } from "path"
import { getDirname } from "rokay/server/node"
import { getRokayServerConfig } from "rokay/server/server"

import { Unicorn } from "./unicorn.js"


Unicorn({
  server: getRokayServerConfig({
    port: 7024,
    staticDir: resolve(getDirname(import.meta), "..", "..", "static"),
  }),
})
