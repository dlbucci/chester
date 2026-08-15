import { apd, ApdArg } from "rokay/browser/core"
import { h1 } from "rokay/browser/elt"

import { App } from "../shared/app.js"


export const
  Base = (_app: App, ...args: ApdArg[]) =>
    apd(
      h1(apd("Unicorn")),

      ...args,
    )
