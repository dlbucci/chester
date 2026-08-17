import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { border } from "rokay/browser/style"
import { V, VZ } from "rokay/math/v"

import { Unicorn, UnicornStateIdle } from "../shared/unicorns/types.gen"

import { AppClient } from "./app"
import { WorldFM } from "./worlds/form-models.gen"
import { WorldCanvas } from "./worlds/world-canvas"


export const
  IndexPage = (app: AppClient) => {
    const world = WorldFM(0, Unicorn(VZ, V(1, 1), UnicornStateIdle()))

    return div(border("1px solid #000"), apd(WorldCanvas(app, world)))
  }
