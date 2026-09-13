import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { onPointerdown } from "rokay/browser/on"
import { animation, background, backgroundColor, color, height, left, position, top, userSelect, width,
  zIndex } from "rokay/browser/style"
import { MixArgs } from "rokay/mix"

import { Level } from "../../shared/levels/types.gen"
import { WordDiv } from "../alphabet"
import { playBuffer } from "../sfx/sfx"
import { sfxChesterFadeIn, sfxChesterFadeUp } from "../sfx/slide"
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
      zIndex(1),
      ...args
    ),

  BossIntroOverlay = (level: Level, timeSec: number, onDone: () => void) => {
    playBuffer(sfxChesterFadeIn)
    setTimeout(onDone, timeSec * 1000)
    return Overlay(animation(`${timeSec}s boss-intro-overlay forwards`), $gradientOverlay, apd(
      div(color(level.color), $messageEnter, apd(WordDiv(level.bossName, {
        color: level.color,
        outline: "#fff",
        scale: 2,
      }))),
    ))
  },

  FadeInOverlay = (timeSec: number, color: string, onDone: () => void) => {
    setTimeout(onDone, timeSec * 1000)
    return Overlay(animation(`${timeSec}s fade-in forwards`), backgroundColor(color))
  },

  FlashInOverlay = (up: boolean, timeSec: number, color: string, onDone: () => void) => {
    playBuffer(up ? sfxChesterFadeUp : sfxChesterFadeIn)
    setTimeout(onDone, timeSec * 1000)
    return Overlay(animation(`${timeSec}s flash-in forwards`), backgroundColor(color))
  },

  FlashOutOverlay = (timeSec: number, color: string, onDone: () => void) => {
    setTimeout(onDone, timeSec * 1000)
    return Overlay(animation(`${timeSec}s flash-out forwards`), backgroundColor(color))
  },

  TitleOverlay = (onClick: () => void) =>
    Overlay(apd(WordDiv("Chester", { outline: "#333", scale: 2 })), onPointerdown(onClick))
