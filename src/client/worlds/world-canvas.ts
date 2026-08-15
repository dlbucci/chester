import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { $ } from "rokay/browser/prop"
import { backgroundColor, border } from "rokay/browser/style"
import { tab2d } from "rokay/data/array"
import { pick } from "rokay/math/random"
import { scaleComponents_, V } from "rokay/math/v"
import { derive } from "rokay/prop/derive"

import { Level } from "../../shared/levels/types.gen"
import { Unicorn } from "../../shared/unicorns/types.gen"
import { AppClient } from "../app"

import { WorldFM } from "./form-models.gen"


export const
  LEVEL_COLORS = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],

  WorldCanvas = (app: AppClient, world: WorldFM) => {
    const
      { unicorn } = world,
      level = derive(world.level, (_level) => {
        const
          _size = app.size.get(),
          size = V(_size.board.x, _size.board.y * 10),
          data = tab2d(size.y, size.x, (): Unicorn | undefined => undefined)
        data[size.y - 2][pick([2, size.x - 3])] = unicorn
        unicorn.pos = scaleComponents_(V(pick([2, size.x - 3]), size.y - 2), _size.cell)
        return Level(data, size)
      })

    return canvas(
      border("1px solid #000"),
      $(world.level, (_level) => backgroundColor(LEVEL_COLORS[_level])),
      withCtx((ctx) => {
        const
          draw = () => {
            const
              _level = level.get(),
              _size = app.size.get()
            ctx.translate(0, -Math.min(unicorn.pos.y, _size.cell.y * _level.size.y - _size.size.y))
            ctx.fillStyle = "rgba(0, 0, 0, .125)"
            level.get().data.forEach((row, _r) => {
              row.forEach((_col, _c) => {
                if ((_r + _c) % 2 === 0) {
                  ctx.fillRect(_c * _size.cell.x, _r * _size.cell.y, _size.cell.x, _size.cell.y)
                }
              })
            })
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
      }),
    )
  }
