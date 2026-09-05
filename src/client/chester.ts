import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { mount } from "rokay/browser/mount"
import { $ } from "rokay/browser/prop"
import { BrowserRouter } from "rokay/browser/router"
import { position, size as sizeStyle, transform } from "rokay/browser/style"
import { VisibleProp } from "rokay/browser/visible"
import { WindowSize } from "rokay/browser/window"
import { divide, divideComponents, floor, plus, scale, V } from "rokay/math/v"
import { mix } from "rokay/mix"
import { Asink } from "rokay/prop/async"
import { derive } from "rokay/prop/derive"
import { Prop } from "rokay/prop/prop"

import { GameState, GameStateTitle } from "../shared/games/types.gen.js"

import { AppClient, GameSize } from "./app.js"
import { load } from "./assets.js"
import { SIZE_BOARD_PIXELS } from "./const.js"
import { matchLoader } from "./elts/loader.syn.js"
import { IndexPages } from "./pages.gen.js"
import { $s100 } from "./style/utils.gen.js"
import { WorldDisplay } from "./worlds/world-display.js"


mount(document.body, () => {
  const
    router = BrowserRouter(),
    size = derive(WindowSize(), (window): GameSize => {
      const options = floor(divideComponents(window, plus(SIZE_BOARD_PIXELS, V(0, 16))))
      const zoom = Math.max(1, Math.min(options.x, options.y))
      return {
        window,
        windowUnzoomed: floor(divide(window, zoom)),
        zoom,
        zoomedSize: scale(SIZE_BOARD_PIXELS, zoom),
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
      // update after the fact since IndexPages needs app
      const routedGameState = router.derive<GameState>(IndexPages({}), () => GameStateTitle())
        .listen((view) => {
          gameState.set(() => view)
        })
      const gameState = Prop(() => routedGameState.get())

      return div($s100, apd(WorldDisplay(app, gameState)))
    })),
  ))
})
