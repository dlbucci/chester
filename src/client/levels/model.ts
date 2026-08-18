import { tab } from "rokay/data/array"
import { pick } from "rokay/math/random"
import { V } from "rokay/math/v"

import { Level } from "../../shared/levels/types.gen"
import { Thing } from "../../shared/things/types.gen"
import { Unicorn, UnicornStateIdle } from "../../shared/unicorns/types.gen"
import { AppClient } from "../app"
import { cellToPos } from "../cells/utils"
import { getMoves } from "../unicorn/model"


export const
  LEVELS = (app: AppClient) =>
    tab(8, (_level) => {
      const
        size = V(8, (5 + _level) * 8),
        cell = V(pick([2, size.x - 3]), size.y - 2),
        unicorn = Unicorn(
          V(pick([2, size.x - 3]), size.y - 2),
          cellToPos(app, cell),
          V(1, 1),
          UnicornStateIdle(0, getMoves(cell, size)),
        ),
        things: Thing[] = []

      return Level(size, things, unicorn)
    })
