import { pick } from "rokay/math/random"
import { V } from "rokay/math/v"

import { Level } from "../../shared/levels/types.gen"
import { getMoves, THING_STATS } from "../../shared/things/model"
import { Thing, ThingStateIdle } from "../../shared/things/types.gen"
import { World } from "../../shared/worlds/types.gen"
import { cellToPos } from "../cells/utils"
import { SIZE_BOARD } from "../const"


export const
  worldNew = (level: Level): World => {
    const
      cell = V(pick([2, level.size.x - 3]), level.size.y - 2),
      unicorn = Thing("good", cell, cellToPos(cell), V(1, 1), ThingStateIdle(0, []), "unicorn"),
      bossCell = V(Math.floor(SIZE_BOARD.x / 2), 0),
      boss = Thing(
        "bad",
        bossCell,
        cellToPos(bossCell),
        V(1, 1),
        ThingStateIdle(THING_STATS[level.bossName].cooldown, []),
        level.bossName,
      ),
      things: Thing[] = [unicorn, boss]
    unicorn.state = ThingStateIdle(0, getMoves(unicorn, level.size))
    return World(boss, [], [], things, unicorn)
  }
