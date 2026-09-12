import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { onPointerdown } from "rokay/browser/on"
import { animation, background, backgroundColor, color, height, left, position, top, userSelect, width } from "rokay/browser/style"
import { MixArgs } from "rokay/mix"

import { Level } from "../../shared/levels/types.gen"
import { pgIndex } from "../../shared/pages.gen"
import { AppClient } from "../app"
import { $flexCenter, $messageEnter } from "../style/utils.gen"


export const
  $gradientOverlay = background(
    "linear-gradient(to bottom, rgba(0,0,0,.25) 20%, rgba(0,0,0,.75) 50%, rgba(0,0,0,.25) 80%",
  ),

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
    return Overlay(animation(`${timeSec}s boss-intro-overlay forwards`), $gradientOverlay, apd(
      div(color(level.color), $messageEnter, apd(level.bossName)),
    ))
  },

  DeadOverlay = (app: AppClient) =>
    Overlay(
      animation("1s fade-in"),
      $gradientOverlay,
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

  FlashInOverlay = (timeSec: number, color: string, onDone: () => void) => {
    setTimeout(onDone, timeSec * 1000)
    return Overlay(animation(`${timeSec}s flash-in forwards`), backgroundColor(color))
  },

  FlashOutOverlay = (timeSec: number, color: string, onDone: () => void) => {
    setTimeout(onDone, timeSec * 1000)
    return Overlay(animation(`${timeSec}s flash-out forwards`), backgroundColor(color))
  },

  TitleOverlay = (onClick: () => void) =>
    Overlay(apd("Chester"), onPointerdown(onClick))
