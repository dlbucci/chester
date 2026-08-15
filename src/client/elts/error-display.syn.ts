import { apd } from "rokay/browser/core"
import { h3, pre } from "rokay/browser/elt"


export const
  ErrorDisplay = (error: any) =>
    error.message ? h3(apd(error.message)) : pre(apd(JSON.stringify(error, null, 2)))


