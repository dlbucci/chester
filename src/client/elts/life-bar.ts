import { size as sizeAttr } from "rokay/browser/attr"
import { apd } from "rokay/browser/core"
import { canvas, div, span } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { match, matchIf } from "rokay/browser/match"
import { animation, backgroundColor, borderBottom, fontSize, height, position } from "rokay/browser/style"
import { MixArgs } from "rokay/mix"
import { Prop } from "rokay/prop/prop"

import { GameState } from "../../shared/games/types.gen"
import { AppClient } from "../app"
import { Overlay } from "../levels/overlays"
import { $flexRow } from "../style/utils.gen"


export const
  LifeBar = (
    app: AppClient,
    lifeUp: Prop<boolean>,
    lives: Prop<number>,
    gameState: Prop<GameState>,
  ) =>
    Bar(lifeUp, borderBottom("1px solid #333"), apd(match(gameState, (_gameState) =>
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
    ))),

  Bar = (lifeUp: Prop<boolean>, ...args: MixArgs<HTMLDivElement>) =>
    div(backgroundColor("gray"), height("17px"), position("relative"), ...args, apd(
      matchIf(lifeUp, () =>
        Overlay(
          animation("1s step-start infinite flash2"),
          backgroundColor("#333"),
          fontSize("8px"),
          apd("Life Up"),
        )
      ),
    ))
