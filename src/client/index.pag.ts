import { VZ } from "rokay/math/v"

import { Unicorn } from "../shared/unicorn/types.gen"

import { AppClient } from "./app"
import { WorldFM } from "./worlds/form-models.gen"
import { WorldCanvas } from "./worlds/world-canvas"


export const
  IndexPage = (app: AppClient) => {
    const world = WorldFM(0, Unicorn(VZ))

    return WorldCanvas(app, world)
  }
