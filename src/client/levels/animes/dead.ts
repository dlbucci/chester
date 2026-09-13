import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { onPointerdown } from "rokay/browser/on"
import { animation } from "rokay/browser/style"

import { WordDiv } from "../../alphabet"
import { $messageEnter } from "../../style/utils.gen"
import { $gradientOverlay, Overlay } from "../overlays"

import { Anime, AnimeOverlay } from "./model"


export const
  dead = (onClick: () => void): Anime[] => [
    AnimeOverlay(() =>
      Overlay(
        animation("1s fade-in"),
        $gradientOverlay,
        apd(div($messageEnter, apd(WordDiv("YOU DIED", { color: "red", scale: 2 })))),
        onPointerdown(onClick),
      )
    ),
  ]
