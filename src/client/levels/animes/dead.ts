import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { onPointerdown } from "rokay/browser/on"
import { animation, background, color } from "rokay/browser/style"

import { $messageEnter } from "../../style/utils.gen"
import { Overlay } from "../overlays"

import { Anime, AnimeOverlay } from "./model"


export const
  dead = (
    onClick: () => void,
  ): Anime[] => [
    AnimeOverlay(
      () =>
        Overlay(
          animation("1s fade-in"),
          background(
            "linear-gradient(to bottom, rgba(0,0,0,.25) 20%, rgba(0,0,0,.75) 50%, rgba(0,0,0,.25) 80%",
          ),
          color("hsl(352,78%,45%)"),
          apd(div($messageEnter, apd("YOU DIED"))),
          onPointerdown(onClick),
        ),
    ),
  ]
