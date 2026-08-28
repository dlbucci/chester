import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { $ } from "rokay/browser/prop"
import { border, imageRendering } from "rokay/browser/style"
import { VB } from "rokay/math/v"
import { derive } from "rokay/prop/derive"
import { Prop } from "rokay/prop/prop"

import { GameState } from "../../shared/games/types.gen"
import { AppClient } from "../app"
import { $rainbowBackground } from "../elts/rainbow-background"
import { LevelDisplay } from "../levels/level-display"
import { LEVELS } from "../levels/model"
import { $flexCenter, $s100 } from "../style/utils.gen"


export const
  WorldDisplay = (app: AppClient, gameState: Prop<GameState>) => {
    const level = derive(gameState, (_gameState) =>
      _gameState.t === "title" ? 0 : _gameState.level.index
    )

    return div(
      $(level, (_level) => $rainbowBackground(VB(32), 8, (_level + 1) / LEVELS.length)),
      imageRendering("pixelated"),
      $flexCenter,
      $s100,
      apd(div(border("1px solid #000"), apd(LevelDisplay(app, gameState)))),
    )
  }
