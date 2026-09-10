import { pick } from "rokay/math/random"
import { V } from "rokay/math/v"

import { Level } from "../../shared/levels/types.gen"
import { getMoves } from "../../shared/things/model"
import { Thing, ThingStateIdle } from "../../shared/things/types.gen"
import { World } from "../../shared/worlds/types.gen"
import { cellToPos } from "../cells/utils"


export const
  worldNew = (level: Level): World => {
    const
      cell = V(pick([2, level.size.x - 3]), level.size.y - 2),
      unicorn = Thing("good", cell, 1, cellToPos(cell), V(1, 1), ThingStateIdle(0, []), "unicorn"),
      things: Thing[] = [unicorn]
    unicorn.state = ThingStateIdle(0, getMoves(unicorn, level.size))
    return World([], [], things, unicorn)
  }
