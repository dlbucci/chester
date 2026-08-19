import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { $ } from "rokay/browser/prop"
import { border, imageRendering } from "rokay/browser/style"
import { VB } from "rokay/math/v"

import { Level } from "../../shared/levels/types.gen"
import { AppClient } from "../app"
import { $rainbowBackground } from "../elts/rainbow-background"
import { $flexCenter, $s100 } from "../style/utils.gen"

import { WorldFM } from "./form-models.gen"
import { WorldCanvas } from "./world-canvas"


export const
  WorldDisplay = (app: AppClient, levels: Level[], world: WorldFM) => {
    return div(
      $(world.level, (_level) => $rainbowBackground(VB(32), 8, (_level + 1) / levels.length)),
      imageRendering("pixelated"),
      $flexCenter,
      $s100,
      apd(div(border("1px solid #000"), apd(WorldCanvas(app, levels, world)))),
    )
  }
