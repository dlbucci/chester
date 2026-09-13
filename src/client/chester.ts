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
import { PropBasic } from "rokay/prop/basic"
import { derive } from "rokay/prop/derive"

import { GameState, GameStateTitle } from "../shared/games/types.gen.js"

import { AppClient, GameSize } from "./app.js"
import { ASSETS } from "./assets.js"
import { SIZE_BOARD_PIXELS } from "./const.js"
import { LevelDisplay } from "./levels/level-display.js"
import { IndexPages } from "./pages.gen.js"
import { $s100 } from "./style/utils.gen.js"


mount(document.body, () => {
  const
    router = BrowserRouter(),
    size = derive(WindowSize(), (window): GameSize => {
      // 34 = 2*(BAR_HEIGHT+BORDER) = 2*(16+1)
      const options = floor(divideComponents(window, plus(SIZE_BOARD_PIXELS, V(0, 34))))
      const zoom = Math.max(1, Math.min(options.x, options.y))
      return {
        window,
        windowUnzoomed: floor(divide(window, zoom)),
        zoom,
        zoomedSize: scale(SIZE_BOARD_PIXELS, zoom),
      }
    }),
    app: AppClient = {
      assets: ASSETS,
      router,
      size,
      visible: VisibleProp(),
    },
    routedGameState = router.derive<GameState>(IndexPages({ app }), () => GameStateTitle())
      .listen((view) => {
        gameState.set(() => view)
      }),
    gameState = PropBasic(routedGameState.get())

  return apd(div(
    position("relative"),
    $(size, ({ windowUnzoomed: { x, y }, zoom }) =>
      mix(sizeStyle((x + 2) + "px", (y + 2) + "px"), transform(`scale(${zoom})`))
    ),
    apd(div($s100, apd(LevelDisplay(app, gameState)))),
  ))
})
