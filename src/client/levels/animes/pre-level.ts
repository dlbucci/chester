import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { match } from "rokay/browser/match"
import { onPointerdown } from "rokay/browser/on"
import { fontSize, textAlign } from "rokay/browser/style"
import { Prop } from "rokay/prop/prop"

import { Level } from "../../../shared/levels/types.gen"
import { $messageEnter } from "../../style/utils.gen"
import { Overlay } from "../overlays"

import { Anime, AnimeOverlay } from "./model"


export const
  preLevel = (level: Level, onNearEnd: () => void, onEnd: () => void): Anime[] => {
    return [
      AnimeOverlay(() => {
        const
          { preamble } = level,
          messageIndex = Prop(() => 0)

        return Overlay(
          fontSize(".8em"),
          apd(match(messageIndex, (index) =>
            div($messageEnter, textAlign("center"), apd(preamble[index]))
          )),
          onPointerdown(() => {
            messageIndex.set((_index) => {
              if (_index + 1 < preamble.length) {
                if (_index + 1 === preamble.length - 1) { onNearEnd() }
                return _index + 1
              }
              onEnd()
              return _index
            })
          }),
        )
      }),
    ]
  }
