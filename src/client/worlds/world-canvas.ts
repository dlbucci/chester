import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { $ } from "rokay/browser/prop"
import { backgroundColor } from "rokay/browser/style"

import { AppClient } from "../app"

import { WorldFM } from "./form-models.gen"


export const
  LEVEL_COLORS = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],

  WorldCanvas = (app: AppClient, world: WorldFM) => {
    const { level, unicorn } = world

    return canvas($(level, (_level) => backgroundColor(LEVEL_COLORS[_level])), withCtx((ctx) => {
      const
        draw = () => {
          ctx.drawImage(app.assets.unicorn, unicorn.pos.x, unicorn.pos.y)
        },
        step = () => {}

      app.size.listenAndCall((_size) => {
        ctx.canvas.width = _size.size.x
        ctx.canvas.height = _size.size.y

        draw()
      })

      app.visible.raf(() => {
        step()
        draw()
      })
    }))
  }
