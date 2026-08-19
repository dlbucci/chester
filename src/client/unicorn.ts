import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { mount } from "rokay/browser/mount"
import { $ } from "rokay/browser/prop"
import { BrowserRouter } from "rokay/browser/router"
import { position, size as sizeStyle, transform } from "rokay/browser/style"
import { VisibleProp } from "rokay/browser/visible"
import { WindowSize } from "rokay/browser/window"
import { divide, divideComponents, floor_, scale, scaleComponents, V } from "rokay/math/v"
import { mix } from "rokay/mix"
import { Asink } from "rokay/prop/async"
import { derive } from "rokay/prop/derive"

import { AppClient, GameSize } from "./app.js"
import { load } from "./assets.js"
import { matchLoader } from "./elts/loader.syn.js"
import { IndexPages } from "./pages.gen.js"
import { $s100 } from "./style/utils.gen.js"


mount(document.body, () => {
  const
    router = BrowserRouter(),
    size = derive(WindowSize(), (window): GameSize => {
      const cell = V(16, 16)
      const board = V(8, 8)
      const size = scaleComponents(cell, board)
      const options = floor_(divideComponents(window, size))
      const zoom = Math.max(1, Math.min(options.x, options.y))
      return {
        board,
        cell,
        cellHalf: divide(cell, 2),
        size,
        window,
        windowUnzoomed: floor_(divide(window, zoom)),
        zoom,
        zoomedSize: scale(size, zoom),
      }
    }),
    assets = Asink({
      gen: () => load(),
    })

  return apd(div(
    position("relative"),
    $(size, ({ windowUnzoomed: { x, y }, zoom }) =>
      mix(sizeStyle((x + 2) + "px", (y + 2) + "px"), transform(`scale(${zoom})`))
    ),
    apd(matchLoader(assets, (assets) => {
      const app: AppClient = {
        assets,
        router,
        size,
        visible: VisibleProp(),
      }

      return div($s100, apd(app.router.match(IndexPages({ app }), (_else) =>
        div(apd("Uh, where ya goin', bruv?"))
      )))
    })),
  ))
})
