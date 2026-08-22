import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { mount } from "rokay/browser/mount"
import { $ } from "rokay/browser/prop"
import { BrowserRouter } from "rokay/browser/router"
import { position, size as sizeStyle, transform } from "rokay/browser/style"
import { VisibleProp } from "rokay/browser/visible"
import { WindowSize } from "rokay/browser/window"
import { divide, divideComponents, floor, scale } from "rokay/math/v"
import { mix } from "rokay/mix"
import { Asink } from "rokay/prop/async"
import { derive } from "rokay/prop/derive"
import { PropConst } from "rokay/prop/prop"

import { GameState, GameStateTitle } from "../shared/games/types.gen.js"

import { AppClient, GameSize } from "./app.js"
import { load } from "./assets.js"
import { SIZE_BOARD_PIXELS } from "./const.js"
import { matchLoader } from "./elts/loader.syn.js"
import { LEVELS } from "./levels/model.js"
import { IndexPages } from "./pages.gen.js"
import { $s100 } from "./style/utils.gen.js"
import { WorldFM } from "./worlds/form-models.gen.js"
import { WorldDisplay } from "./worlds/world-display.js"


mount(document.body, () => {
  const
    router = BrowserRouter(),
    size = derive(WindowSize(), (window): GameSize => {
      const options = floor(divideComponents(window, SIZE_BOARD_PIXELS))
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
        state: PropConst(GameStateTitle()),
        visible: VisibleProp(),
      }
      // update after the fact since IndexPages needs app
      app.state = router.derive<GameState>(IndexPages({}), () => GameStateTitle())

      const world = WorldFM(0)

      return div($s100, apd(WorldDisplay(app, LEVELS, app.state, world)))
    })),
  ))
})
