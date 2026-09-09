import { size as sizeAttr } from "rokay/browser/attr"
import { apd } from "rokay/browser/core"
import { canvas, div } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { match } from "rokay/browser/match"
import { onClick } from "rokay/browser/on"
import { backgroundColor, height } from "rokay/browser/style"
import { remove } from "rokay/data/array"
import { minus, V } from "rokay/math/v"
import { Prop } from "rokay/prop/prop"

import { GameState } from "../../shared/games/types.gen"
import { Thing, ThingStateIdle } from "../../shared/things/types.gen"
import { AppClient } from "../app"
import { getSprite } from "../assets"
import { cellToPos } from "../cells/utils"
import { Anime } from "../levels/animes/model"
import { $flexRow } from "../style/utils.gen"


export const
  CapturedBar = (
    app: AppClient,
    animes: Prop<Anime[]>,
    captured: Prop<Thing[]>,
    gameState: Prop<GameState>,
  ) =>
    div(backgroundColor("gray"), height("16px"), apd(match(captured, (_captured) =>
      div($flexRow, apd(..._captured.map((thing) =>
        canvas(
          sizeAttr(16, 16),
          withCtx((ctx) => {
            ctx.drawImage(getSprite(app.assets, thing), 0, 0)
          }),
          onClick(() => {
            const _gameState = gameState.get()
            const _anime = animes.get()[0]
            if (_gameState.t === "level" && _anime == null) {
              const { world } = _gameState
              const cell = minus(world.unicorn.cell, V(0, 1))
              world.things.push(Thing(
                "good",
                cell,
                cellToPos(cell),
                V(1, 1),
                ThingStateIdle(1.5, []),
                thing.type,
              ))
              captured.set((_captured) => remove(_captured, thing))
            }
          }),
        )
      )))
    )))
