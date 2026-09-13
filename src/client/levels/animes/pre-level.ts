import { apd } from "rokay/browser/core"
import { div } from "rokay/browser/elt"
import { match } from "rokay/browser/match"
import { onPointerdown } from "rokay/browser/on"
import { padding, textAlign } from "rokay/browser/style"
import { Prop } from "rokay/prop/prop"

import { Level } from "../../../shared/levels/types.gen"
import { SentenceDiv, WordDiv } from "../../alphabet"
import { $messageEnter } from "../../style/utils.gen"
import { LEVELS } from "../model"
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
          padding("12px"),
          apd(match(messageIndex, (index) => {
            const text = preamble[index]
            const bossLevel = LEVELS.find((l) => text.includes(l.bossName))
            if (bossLevel == null) {
              return div($messageEnter, textAlign("center"), apd(SentenceDiv(text.split(/\s+/))))
            }
            const [before, after] = text.split(bossLevel.bossName)
            return div($messageEnter, textAlign("center"), apd(SentenceDiv([
              ...before.trim().split(/\s+/),
              WordDiv(bossLevel.bossName, { color: bossLevel.color }),
              ...after.trim().split(/\s+/),
            ])))
          })),
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
