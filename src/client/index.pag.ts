import { VZ } from "rokay/math/v"

import { Unicorn } from "../shared/unicorn/types.gen"
import { World } from "../shared/worlds/types.gen"

import { AppClient } from "./app"
import { WorldCanvas } from "./worlds/world-canvas"


export const
  IndexPage = (app: AppClient) => {
    const world = World(Unicorn(VZ))

    return WorldCanvas(app, world)
  }
