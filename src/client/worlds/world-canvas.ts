import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { onPointerdown } from "rokay/browser/on"
import { $ } from "rokay/browser/prop"
import { backgroundColor } from "rokay/browser/style"
import { rafLoop } from "rokay/browser/visible"
import { tab2d } from "rokay/data/array"
import { pick } from "rokay/math/random"
import { divide_, divideComponents_, floor_, minus_, scaleComponents, scaleComponents_, V } from "rokay/math/v"
import { derive } from "rokay/prop/derive"

import { Level } from "../../shared/levels/types.gen"
import { Unicorn } from "../../shared/unicorns/types.gen"
import { AppClient, GameSize } from "../app"

import { WorldFM } from "./form-models.gen"


export const
  LEVEL_COLORS = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],

  WorldCanvas = (app: AppClient, world: WorldFM) => {
    const
      { unicorn } = world,
      getCameraOffset = (unicorn: Unicorn, level: Level, size: GameSize) => {
        return V(
          0,
          -Math.min(
            unicorn.pos.y - size.cell.y * size.board.y / 2,
            size.cell.y * level.size.y - size.size.y,
          ),
        )
      },
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
      $(world.level, (_level) => backgroundColor(LEVEL_COLORS[_level])),
      onPointerdown(
        (el, ev) => {
          const _size = app.size.get()
          const pos = minus_(
            floor_(divide_(
              minus_(V(ev.clientX, ev.clientY), el.getBoundingClientRect()),
              _size.zoom,
            )),
            getCameraOffset(unicorn, level.get(), _size),
          )
          const cell = floor_(divideComponents_(pos, _size.cell))
          unicorn.pos = scaleComponents(cell, _size.cell)
        },
      ),
      withCtx((ctx) => {
        const
          draw = () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            const
              _level = level.get(),
              _size = app.size.get()
            ctx.save()
            const offset = getCameraOffset(unicorn, _level, _size)
            ctx.translate(offset.x, offset.y)
            ctx.fillStyle = "rgba(0, 0, 0, .125)"
            level.get().data.forEach((row, _r) => {
              row.forEach((_col, _c) => {
                if ((_r + _c) % 2 === 0) {
                  ctx.fillRect(_c * _size.cell.x, _r * _size.cell.y, _size.cell.x, _size.cell.y)
                }
              })
            })
            ctx.drawImage(app.assets.unicorn, unicorn.pos.x, unicorn.pos.y)
            ctx.restore()
          },
          step = () => {}

        app.size.listenAndCall((_size) => {
          ctx.canvas.width = _size.size.x
          ctx.canvas.height = _size.size.y

          draw()
        })

        rafLoop(app.visible, () => {
          step()
          draw()
        })
      }),
    )
  }
