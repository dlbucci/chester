import { size as sizeAttr, src } from "rokay/browser/attr"
import { apd, Elt } from "rokay/browser/core"
import { div, img } from "rokay/browser/elt"
import { matchIf } from "rokay/browser/match"
import { size } from "rokay/browser/style"
import { Async } from "rokay/prop/async"
import { PropView } from "rokay/prop/prop"

import { $flexCenter, $flexRow, $s100 } from "../style/utils.gen"

import { ErrorDisplay } from "./error-display.syn"


export const
  Loader = <T>(prop: PropView<Async<T>>, render: (t: T) => Elt | undefined) =>
    div($s100, apd(matchLoader(prop, render))),

  matchLoader = <T>(prop: PropView<Async<T>>, render: (t: T) => Elt | undefined) =>
    matchIf(prop, (prop) =>
      prop.t === "load" ?
        div($flexCenter, $flexRow, $s100, apd(
          img(src("/art/icons/16.png"), sizeAttr(16), size("64px")),
        ))
      : prop.t === "error" ?
        ErrorDisplay(prop.error)
      :
        render(prop.data)
    )
