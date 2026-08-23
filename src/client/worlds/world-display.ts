import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { matchIf } from "rokay/browser/match"
import { $ } from "rokay/browser/prop"
import { border, imageRendering } from "rokay/browser/style"
import { VB } from "rokay/math/v"
import { derive } from "rokay/prop/derive"
import { Prop } from "rokay/prop/prop"

import { GameState } from "../../shared/games/types.gen"
import { Level } from "../../shared/levels/types.gen"
import { AppClient } from "../app"
import { $rainbowBackground } from "../elts/rainbow-background"
import { LevelDisplay } from "../levels/level-display"
import { $flexCenter, $s100 } from "../style/utils.gen"

import { WorldFM } from "./form-models.gen"


export const
  WorldDisplay = (app: AppClient, levels: Level[], gameState: Prop<GameState>, world: WorldFM) => {
    const level = derive(world.level, (_level) => levels[_level])

    return div(
      $(world.level, (_level) => $rainbowBackground(VB(32), 8, (_level + 1) / levels.length)),
      imageRendering("pixelated"),
      $flexCenter,
      $s100,
      apd(matchIf(level, (level) =>
        div(border("1px solid #000"), apd(LevelDisplay(app, level, gameState)))
      )),
    )
  }
