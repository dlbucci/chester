import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { mount } from "rokay/browser/mount"
import { $ } from "rokay/browser/prop"
import { BrowserRouter } from "rokay/browser/router"
import { position, size as sizeStyle, transform } from "rokay/browser/style"
import { Visible } from "rokay/browser/visible"
import { WindowSize } from "rokay/browser/window"
import { divideComponents, floor_, scale, scaleComponents, V } from "rokay/math/v"
import { mix } from "rokay/mix"
import { Asink } from "rokay/prop/async"
import { derive } from "rokay/prop/derive"

import { AppClient } from "./app.js"
import { load } from "./assets.js"
import { Loader } from "./elts/loader.syn.js"
import { IndexPages } from "./pages.gen.js"
import { $flexCenter, $s100 } from "./style/utils.gen.js"


mount(document.body, () => {
  const
    router = BrowserRouter(),
    size = derive(WindowSize(), (window) => {
      const cell = V(16, 16)
      const board = V(8, 8)
      const size = scaleComponents(cell, board)
      const options = floor_(divideComponents(window, size))
      const zoom = Math.max(1, Math.min(options.x, options.y))
      return {
        board,
        cell,
        size,
        window,
        zoom,
        zoomedSize: scale(size, zoom),
      }
    }),
    assets = Asink({
      gen: () => load(),
    })

  return apd(div(
    $flexCenter,
    position("relative"),
    $(size, ({ size: { x, y }, zoom }) =>
      mix(sizeStyle((x + 2) + "px", (y + 2) + "px"), transform(`scale(${zoom})`))
    ),
    apd(Loader(assets, (assets) => {
      const app: AppClient = {
        assets,
        router,
        size,
        visible: Visible(),
      }

      return div($s100, apd(router.match(IndexPages({ app }), (_else) =>
        div(apd("Uh, where ya goin', bruv?"))
      )))
    })),
  ))
})
