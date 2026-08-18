import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { onPointerdown } from "rokay/browser/on"
import { $ } from "rokay/browser/prop"
import { backgroundColor } from "rokay/browser/style"
import { rafLoop } from "rokay/browser/visible"
import { last } from "rokay/data/array"
import { divide_, divideComponents_, eq, floor_, iter, len, minus, minus_, plus_, scale_, unit, V, VZ } from "rokay/math/v"
import { derive } from "rokay/prop/derive"

import { Level } from "../../shared/levels/types.gen"
import { Unicorn, UnicornStateIdle, UnicornStateMoveTo } from "../../shared/unicorns/types.gen"
import { AppClient, GameSize } from "../app"
import { cellToPos } from "../cells/utils"
import { LEVELS } from "../levels/model"
import { getMoves, UNICORN_COOLDOWN_SEC, UNICORN_OFFSET } from "../unicorn/model"

import { WorldFM } from "./form-models.gen"


export const
  LEVEL_COLORS = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
  WorldCanvas = (app: AppClient, world: WorldFM) => {
    const
      getCameraOffset = (unicorn: Unicorn, level: Level, size: GameSize) =>
        V(
          0,
          -Math.max(
            0,
            Math.min(
              unicorn.pos.y - size.cell.y * size.board.y / 2,
              size.cell.y * level.size.y - size.size.y,
            ),
          ),
        ),

      levels = LEVELS(app),

      level = derive(world.level, (_level) => levels[_level])

    return canvas(
      $(world.level, (_level) => backgroundColor(LEVEL_COLORS[_level])),
      onPointerdown(
        (el, ev) => {
          const { unicorn } = level.get()
          if (unicorn.state.t !== "idle" || unicorn.state.cooldown > 0) { return }
          const _size = app.size.get()
          const pos = minus_(
            floor_(divide_(
              minus_(V(ev.clientX, ev.clientY), el.getBoundingClientRect()),
              _size.zoom,
            )),
            getCameraOffset(unicorn, level.get(), _size),
          )
          const cell = floor_(divideComponents_(pos, _size.cell))
          const path = unicorn.state.moves.find((path) => eq(last(path), cell))
          if (path == null) { return }
          unicorn.cell = cell
          unicorn.state = UnicornStateMoveTo(path.map((cell) => cellToPos(app, cell)), 1)
          if (last(unicorn.state.path).x < unicorn.pos.x) {
            unicorn.scale.x = -1
          } else if (last(unicorn.state.path).x > unicorn.pos.x) {
            unicorn.scale.x = 1
          }
        },
      ),
      withCtx((ctx) => {
        const
          draw = () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            const
              _level = level.get(),
              { unicorn } = _level,
              _size = app.size.get()
            ctx.save()
            const offset = getCameraOffset(unicorn, _level, _size)
            ctx.translate(offset.x, Math.round(offset.y))
            ctx.fillStyle = "rgba(0, 0, 0, .125)"
            iter(VZ, minus(_level.size, V(1, 1)), ({ x, y }) => {
              if ((x + y) % 2 === 0) {
                ctx.fillRect(x * _size.cell.x, y * _size.cell.y, _size.cell.x, _size.cell.y)
              }
            })

            if (unicorn.state.t === "idle") {
              const COOLDOWN_OFFSET = Math.ceil(
                unicorn.state.cooldown / UNICORN_COOLDOWN_SEC * _size.cell.y,
              )
              ctx.fillStyle = "rgba(255,255,255,.5)"
              unicorn.state.moves.forEach((path) => {
                const move = last(path)
                ctx.fillRect(
                  move.x * _size.cell.x,
                  move.y * _size.cell.y + COOLDOWN_OFFSET,
                  _size.cell.x,
                  _size.cell.y - COOLDOWN_OFFSET,
                )
              })
            }

            ctx.save()
            ctx.translate(Math.round(unicorn.pos.x), Math.round(unicorn.pos.y))
            ctx.scale(unicorn.scale.x, unicorn.scale.y)
            ctx.drawImage(app.assets.unicorn, -UNICORN_OFFSET.x, -UNICORN_OFFSET.y)
            ctx.restore()

            ctx.restore()
          },
          step = () => {
            const { unicorn } = level.get()
            if (unicorn.state.t === "idle" && unicorn.state.cooldown > 0) {
              unicorn.state.cooldown -= 1 / 60
            } else if (unicorn.state.t === "moveTo") {
              let next = unicorn.state.path[0]
              unicorn.pos = plus_(unicorn.pos, scale_(
                unit(minus(next, unicorn.pos)),
                unicorn.state.speed,
              ))
              if (len(minus(next, unicorn.pos)) < .5) {
                unicorn.pos = next
                unicorn.state.path = unicorn.state.path.slice(1)
                if (unicorn.state.path.length === 0) {
                  unicorn.state = UnicornStateIdle(UNICORN_COOLDOWN_SEC, getMoves(
                    unicorn.cell,
                    level.get().size,
                  ))
                }
              }
            }
          }

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
