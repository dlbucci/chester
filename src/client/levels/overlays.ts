import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { match } from "rokay/browser/match"
import { onPointerdown } from "rokay/browser/on"
import { animation, backgroundColor, color, flexDirection, fontSize, gap, height, left, position, textAlign,
  top, userSelect, whiteSpace, width } from "rokay/browser/style"
import { MixArgs } from "rokay/mix"
import { Prop } from "rokay/prop/prop"

import { GameState, GameStateLevel, GameStateLevelPre } from "../../shared/games/types.gen"
import { Level } from "../../shared/levels/types.gen"
import { pgIndex, pgLevel } from "../../shared/pages.gen"
import { AppClient } from "../app"
import { $flexCenter, $messageEnter } from "../style/utils.gen"


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

  BossIntroOverlay = (level: Level, timeSec: number, onDone: () => void) => {
    setTimeout(onDone, timeSec * 1000)
    return Overlay(animation(`boss-intro-overlay ${timeSec}s`), apd(
      div(color(level.color), $messageEnter, apd(level.bossName)),
    ))
  },

  DeadOverlay = (app: AppClient) =>
    Overlay(
      backgroundColor("hsla(0, 0%, 20%, .75)"),
      color("hsl(352,78%,45%)"),
      apd(div($messageEnter, apd("YOU DIED"))),
      onPointerdown(() => {
        app.router.replace(pgIndex())
      }),
    ),

  FlashOverlay = (
    timeSec: number,
    color: string,
    { onDone, onWhite }: { onDone(): void, onWhite(): void },
  ) => {
    setTimeout(onWhite, timeSec * 500)
    setTimeout(onDone, timeSec * 1000)
    return Overlay(animation(`flash ${timeSec}s`), backgroundColor(color))
  },

  LevelPreOverlay = (state: GameStateLevelPre, gameState: Prop<GameState>) => {
    const
      { preamble } = state.level,
      messageIndex = Prop(() => 0)

    return Overlay(
      fontSize(".8em"),
      apd(match(messageIndex, (index) =>
        div($messageEnter, textAlign("center"), apd(preamble[index]))
      )),
      onPointerdown(() => {
        messageIndex.set((_index) => {
          if (_index < preamble.length - 1) { return _index + 1 }
          gameState.set(() => GameStateLevel(state.level, state.world))
          return _index
        })
      }),
    )
  },

  LevelWinOverlay = (level: Level, { onClick }: { onClick(): void }) =>
    Overlay(
      backgroundColor("hsla(0, 0%, 20%, .75)"),
      color("hsl(352,78%,45%)"),
      flexDirection("column"),
      gap(".5em"),
      whiteSpace("pre"),
      apd(div($messageEnter, textAlign("center"), apd(level.bossName + "\nDEFEATED"))),
      onPointerdown(onClick),
    ),

  TitleOverlay = (app: AppClient) =>
    Overlay(apd("Chester"), onPointerdown(() => {
      app.router.replace(pgLevel(0))
    })),

  WinOverlay = (app: AppClient) =>
    Overlay(
      backgroundColor("hsla(0, 0%, 20%, .75)"),
      color("hsl(352,78%,45%)"),
      flexDirection("column"),
      gap(".5em"),
      whiteSpace("pre"),
      apd(div($messageEnter, textAlign("center"), apd("YOU WIN\nTHE END"))),
      onPointerdown(() => {
        app.router.replace(pgIndex())
      }),
    )
