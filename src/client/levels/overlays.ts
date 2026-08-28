import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { match } from "rokay/browser/match"
import { onPointerdown } from "rokay/browser/on"
import { backgroundColor, color, height, left, position, textAlign, top, userSelect, width } from "rokay/browser/style"
import { MixArgs } from "rokay/mix"
import { PropBasic } from "rokay/prop/basic"
import { Prop } from "rokay/prop/prop"

import { GameState, GameStateLevel, GameStateLevelPre } from "../../shared/games/types.gen"
import { pgIndex, pgLevel } from "../../shared/pages.gen"
import { AppClient } from "../app"
import { $flexCenter } from "../style/utils.gen"


export const
  Overlay = (...args: MixArgs<HTMLDivElement>) =>
    div(
      backgroundColor("hsla(0, 0%, 20%, .5)"),
      color("#eee"),
      $flexCenter,
      height("100%"),
      left(0),
      position("absolute"),
      top(0),
      userSelect("none"),
      width("100%"),
      ...args
    ),

  DeadOverlay = (app: AppClient) =>
    Overlay(
      backgroundColor("hsla(0, 0%, 20%, .75)"),
      color("hsl(352,78%,45%)"),
      apd("YOU DIED"),
      onPointerdown(() => {
        app.router.replace(pgIndex())
      }),
    ),

  LevelPreOverlay = (state: GameStateLevelPre, gameState: Prop<GameState>) => {
    const
      { preamble } = state.level,
      messageIndex = PropBasic(0)

    return Overlay(
      apd(match(messageIndex, (index) => div(textAlign("center"), apd(preamble[index])))),
      onPointerdown(() => {
        messageIndex.set((_index) => {
          if (_index < preamble.length - 1) { return _index + 1 }
          gameState.set(() => GameStateLevel(state.level, state.world))
          return _index
        })
      }),
    )
  },

  TitleOverlay = (app: AppClient) =>
    Overlay(apd("Chester"), onPointerdown(() => {
      app.router.replace(pgLevel(0))
    }))
