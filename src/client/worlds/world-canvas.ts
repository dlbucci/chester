import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { onPointerdown } from "rokay/browser/on"
import { $ } from "rokay/browser/prop"
import { backgroundColor } from "rokay/browser/style"
import { rafLoop } from "rokay/browser/visible"
import { last, mapNotNil, tab2d } from "rokay/data/array"
import { pick } from "rokay/math/random"
import { divide_, divideComponents_, eq, floor_, len, minus, minus_, plus, plus_, scale_, scaleComponents,
  unit, V, VZ } from "rokay/math/v"
import { derive } from "rokay/prop/derive"

import { Level } from "../../shared/levels/types.gen"
import { Unicorn, UnicornStateIdle, UnicornStateMoveTo } from "../../shared/unicorns/types.gen"
import { AppClient, GameSize } from "../app"
import { UNICORN_COOLDOWN_SEC, UNICORN_OFFSET } from "../unicorn/model"

import { WorldFM } from "./form-models.gen"


export const
  LEVEL_COLORS = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
  KNIGHT_MOVEMENTS = [
    V(-1, -2),
    V(1, -2),
    V(-2, -1),
    V(2, -1),
    V(-2, 1),
    V(2, 1),
    V(-1, 2),
    V(1, 2),
  ],

  WorldCanvas = (app: AppClient, world: WorldFM) => {
    const
      { unicorn } = world,

      cellToUnicornPos = (cell: V) =>
        plus_(scaleComponents(cell, app.size.get().cell), UNICORN_OFFSET),

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

      getMoves = (cell: V, levelSize: V): V[][] =>
        mapNotNil(KNIGHT_MOVEMENTS, (target) => {
          const pos = plus(cell, target)
          return pos.x < 0 || pos.x >= levelSize.x || pos.y < 0 || pos.y >= levelSize.y * 10 ?
              undefined
            :
              getPath(cell, pos)
        }),

      getPath = (from: V, to: V): V[] | undefined => {
        let d = minus(to, from)
        let vert = (Math.abs(d.x) <= Math.abs(d.y))
        const path: V[] = []
        while (!eq(d, VZ)) {
          if (vert) {
            path.push(from = V(from.x, from.y + Math.sign(d.y)))
          } else {
            path.push(from = V(from.x + Math.sign(d.x), from.y))
          }

          d = minus(to, from)
          if ((vert && d.y === 0) || (!vert && d.x === 0)) { vert = !vert }
        }
        return path
      },

      level = derive(world.level, (_level) => {
        const
          _size = app.size.get(),
          size = V(_size.board.x, _size.board.y * 10),
          data = tab2d(size.y, size.x, (): Unicorn | undefined => undefined)
        data[size.y - 2][pick([2, size.x - 3])] = unicorn
        unicorn.cell = V(pick([2, size.x - 3]), size.y - 2)
        unicorn.pos = cellToUnicornPos(unicorn.cell)
        unicorn.state = UnicornStateIdle(0, getMoves(unicorn.cell, size))
        return Level(data, size)
      })

    return canvas(
      $(world.level, (_level) => backgroundColor(LEVEL_COLORS[_level])),
      onPointerdown(
        (el, ev) => {
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
          unicorn.state = UnicornStateMoveTo(path.map(cellToUnicornPos), 1)
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
              _size = app.size.get()
            ctx.save()
            const offset = getCameraOffset(unicorn, _level, _size)
            ctx.translate(offset.x, Math.round(offset.y))
            ctx.fillStyle = "rgba(0, 0, 0, .125)"
            level.get().data.forEach((row, _r) => {
              row.forEach((_col, _c) => {
                if ((_r + _c) % 2 === 0) {
                  ctx.fillRect(_c * _size.cell.x, _r * _size.cell.y, _size.cell.x, _size.cell.y)
                }
              })
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
