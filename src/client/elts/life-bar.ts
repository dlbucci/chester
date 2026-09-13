import { size as sizeAttr } from "rokay/browser/attr"
import { apd } from "rokay/browser/core"
import { canvas, div } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { match, matchIf } from "rokay/browser/match"
import { animation, backgroundColor, borderBottom, fontSize, height, position } from "rokay/browser/style"
import { tab } from "rokay/data/array"
import { MixArgs } from "rokay/mix"
import { Prop } from "rokay/prop/prop"

import { GameState } from "../../shared/games/types.gen"
import { WordDiv } from "../alphabet"
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
        div($flexRow, height("16px"), apd(match(lives, (_lives) =>
          div($flexRow, height("16px"), apd(...tab(_lives, () =>
            canvas(sizeAttr(16, 16), withCtx((ctx) => {
              ctx.drawImage(app.assets.chester(0), 0, 0)
            }))
          )))
        )))
    ))),

  Bar = (lifeUp: Prop<boolean>, ...args: MixArgs<HTMLDivElement>) =>
    div(backgroundColor("gray"), height("17px"), position("relative"), ...args, apd(
      matchIf(lifeUp, () =>
        Overlay(
          animation("1s step-start infinite flash"),
          backgroundColor("#333"),
          fontSize("8px"),
          apd(WordDiv("LIFE UP")),
        )
      ),
    ))
