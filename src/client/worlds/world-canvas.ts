import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"

import { World } from "../../shared/worlds/types.gen"
import { AppClient } from "../app"


export const
  WorldCanvas = (app: AppClient, world: World) => {
    const { unicorn } = world

    return canvas(withCtx((ctx) => {
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
