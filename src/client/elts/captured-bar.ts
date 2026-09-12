import { size as sizeAttr } from "rokay/browser/attr"
import { apd } from "rokay/browser/core"
import { canvas, div } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { match } from "rokay/browser/match"
import { borderTop } from "rokay/browser/style"
import { Prop } from "rokay/prop/prop"

import { GameState } from "../../shared/games/types.gen"
import { Thing } from "../../shared/things/types.gen"
import { AppClient } from "../app"
import { getSprite } from "../assets"
import { $flexRow } from "../style/utils.gen"

import { Bar } from "./life-bar"


export const
  CapturedBar = (
    app: AppClient,
    captured: Prop<Thing[]>,
    gameState: Prop<GameState>,
    lifeUp: Prop<boolean>,
  ) =>
    Bar(lifeUp, borderTop("1px solid #333"), apd(match(captured, (_captured) =>
      div($flexRow, apd(..._captured.slice(0, 8).map((thing) =>
        canvas(sizeAttr(16, 16), withCtx((ctx) => {
          gameState.listenAndCall((_gameState) => {
            ctx.drawImage(
              getSprite(app.assets, thing, _gameState.t === "title" ? 0 : _gameState.level.index),
              16 * thing.frame,
              0,
              16,
              16,
              0,
              0,
              16,
              16,
            )
          })
        }))
      )))
    )))
