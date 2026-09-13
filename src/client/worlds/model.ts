import { filterNotNil, tab } from "rokay/data/array"
import { int, pick } from "rokay/math/random"
import { modulo, V } from "rokay/math/v"

import { Level } from "../../shared/levels/types.gen"
import { getMoves } from "../../shared/things/model"
import { Fruit, Thing, ThingStateIdle } from "../../shared/things/types.gen"
import { Terrain, World } from "../../shared/worlds/types.gen"
import { cellToPos } from "../cells/utils"
import { SIZE_BOARD } from "../const"


export const
  worldNew = (level: Level): World => {
    const
      cell = V(pick([2, level.size.x - 3]), level.size.y - 2),
      unicorn = Thing(
        "good",
        cell,
        level.index === 0 ? 1 : 0,
        cellToPos(cell),
        V(1, 1),
        ThingStateIdle(0, []),
        "unicorn",
      ),
      things: Thing[] = [unicorn],
      fruit = filterNotNil([
        level.index > 0 ? RandomFruit("apple", level.size.y - SIZE_BOARD.y) : undefined,
        level.index > 1 ? RandomFruit("orange", level.size.y - SIZE_BOARD.y) : undefined,
        level.index > 2 ? RandomFruit("banana", level.size.y - SIZE_BOARD.y) : undefined,
      ]),
      terrain: Terrain[][] = tab(level.size.y, () =>
        tab(level.size.x, () =>
          level.index > 5 && int(0, 10) === 0 ?
            "ice"
          : level.index > 3 && int(0, 10) === 0 ?
            "water"
          :
            "grass"
        )
      )
    unicorn.state = ThingStateIdle(0, getMoves(unicorn, level.size))
    return World([], [], fruit, terrain, things, unicorn)
  },

  getTerrain = (world: World, pos: V) => {
    const m = modulo(pos, V(world.terrain[0].length, world.terrain.length))
    return world.terrain[m.y][m.x]
  },

  RandomFruit = (type: Fruit, maxY: number) => {
    const cell = V(int(0, SIZE_BOARD.x - 1), int(SIZE_BOARD.y, maxY - 1))
    return Thing(
      "good",
      cell,
      type === "apple" ?
        0
      : type === "banana" ?
        1
      :
        2,
      cellToPos(cell),
      V(1, 1),
      ThingStateIdle(0, []),
      type,
    )
  }
