import { tab } from "rokay/data/array"
import { pick } from "rokay/math/random"
import { V } from "rokay/math/v"

import { Level } from "../../shared/levels/types.gen"
import { getMoves, KNIGHT_MOVEMENTS, PAWN_MOVEMENTS } from "../../shared/things/model"
import { Thing, ThingPawn } from "../../shared/things/types.gen"
import { Unicorn, UnicornStateIdle } from "../../shared/unicorns/types.gen"
import { AppClient } from "../app"
import { cellToPos } from "../cells/utils"


export const
  LEVELS = (app: AppClient) =>
    tab(8, (_level) => {
      const
        size = V(8, (5 + _level) * 8),
        cell = V(pick([2, size.x - 3]), size.y - 2),
        unicorn = Unicorn(cell, cellToPos(app, cell), V(1, 1), UnicornStateIdle(
          0,
          getMoves(cell, KNIGHT_MOVEMENTS, size),
        )),
        things: Thing[] = tab(8, (x) => {
          const cell = V(x, size.y - 8)
          return ThingPawn(cell, cellToPos(app, cell), V(1, 1), UnicornStateIdle(
            0,
            getMoves(cell, PAWN_MOVEMENTS, size),
          ))
        })

      return Level(size, things, unicorn)
    })
