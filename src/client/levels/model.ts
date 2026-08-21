import { tab } from "rokay/data/array"
import { pick } from "rokay/math/random"
import { V, VZ } from "rokay/math/v"

import { Level, LevelMeta } from "../../shared/levels/types.gen"
import { getMoves, THING_MOVEMENTS } from "../../shared/things/model"
import { Thing, ThingPawn, ThingStateIdle, ThingUnicorn } from "../../shared/things/types.gen"
import { AppClient } from "../app"
import { cellToPos } from "../cells/utils"


export const
  LEVEL_METAS = tab(8, (i) => LevelMeta(i)),

  LEVELS = (app: AppClient) =>
    LEVEL_METAS.map((meta) => {
      const
        size = V(8, (2 + meta.index) * 8),
        cell = V(pick([2, size.x - 3]), size.y - 2),
        unicorn = ThingUnicorn(cell, cellToPos(app, cell), V(1, 1), ThingStateIdle(
          0,
          getMoves(cell, THING_MOVEMENTS.knight, size),
        )),
        things: Thing[] = tab(8, (x) => {
          const cell = V(x, size.y - 8)
          return ThingPawn(cell, cellToPos(app, cell), V(1, 1), ThingStateIdle(
            0,
            getMoves(cell, THING_MOVEMENTS.pawn, size),
          ))
        }),
        boss = ThingPawn(VZ, VZ, V(1, 1), ThingStateIdle(
          0,
          getMoves(VZ, THING_MOVEMENTS.pawn, size),
        ))

      things.push(boss, unicorn)

      return Level(boss, meta, size, things, unicorn)
    })
