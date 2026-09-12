import { float } from "rokay/math/random"
import { scale, unitOfAng } from "rokay/math/v"

import { Thing, ThingStateDying } from "../../../shared/things/types.gen"
import { World } from "../../../shared/worlds/types.gen"

import { AnimeStep } from "./model"


export const
  KillAllEnemiesStep = (world: World, onBossDeath?: (boss: Thing) => void) => {
    let first = true
    return AnimeStep(() => {
      if (world.boss != null) {
        if (world.things.includes(world.boss)) { return }
        if (first) {
          first = false
          onBossDeath?.(world.boss)
        }
      }
      world.things.forEach((thing) => {
        if (thing.state.t === "dying") { return }
        if (thing.alignment === "bad") {
          thing.state = ThingStateDying(
            0,
            1,
            scale(unitOfAng(float(-Math.PI * 3 / 8, -Math.PI * 5 / 8)), 100),
            1,
          )
        }
      })
      return world.things.every((thing) => thing.alignment === "good")
    })
  }
