import { size as sizeAttr } from "rokay/browser/attr"
import { apd } from "rokay/browser/core"
import { canvas, div, span } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { match } from "rokay/browser/match"
import { backgroundColor, height } from "rokay/browser/style"
import { Prop } from "rokay/prop/prop"

import { GameState } from "../../shared/games/types.gen"
import { AppClient } from "../app"
import { $flexRow } from "../style/utils.gen"


export const
  LifeBar = (app: AppClient, lives: Prop<number>, gameState: Prop<GameState>) =>
    div(backgroundColor("gray"), height("16px"), apd(match(gameState, (_gameState) =>
      _gameState.t === "title" ?
        undefined
      :
        div($flexRow, height("16px"), apd(
          canvas(sizeAttr(16, 16), withCtx((ctx) => {
            ctx.drawImage(app.assets.chester(_gameState.level.index), 0, 0)
          })),
          "x",
          match(lives, (_lives) => span(apd(_lives))),
        ))
    )))
