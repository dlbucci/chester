import { tab } from "rokay/data/array"
import { V } from "rokay/math/v"

import { GameStateWin } from "../shared/games/types.gen"
import { Thing, ThingStateIdle } from "../shared/things/types.gen"
import { Terrain, World } from "../shared/worlds/types.gen"

import { AppClient } from "./app"
import { cellToPos } from "./cells/utils"
import { SIZE_BOARD } from "./const"
import { TUCKER_WIN_PATH, UNICORN_WIN_PATH } from "./levels/model"


export const
  WinPage = (app: AppClient) => {
    const
      size = SIZE_BOARD,
      tucker = Thing(
        "good",
        TUCKER_WIN_PATH[0],
        0,
        cellToPos(TUCKER_WIN_PATH[0]),
        V(-1, 1),
        ThingStateIdle(0, []),
        "unicorn",
        { sprite: app.assets.unicorn },
      ),

      unicorn = Thing(
        "good",
        UNICORN_WIN_PATH[0],
        0,
        cellToPos(UNICORN_WIN_PATH[0]),
        V(1, 1),
        ThingStateIdle(0, []),
        "unicorn",
      ),

      terrain: Terrain[][] = tab(size.y, () => tab(size.x, () => "grass"))

    return GameStateWin(World([], [], [], terrain, [unicorn, tucker], unicorn, { tucker }))
  }
