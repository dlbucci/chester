import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { onPointerdown } from "rokay/browser/on"
import { $ } from "rokay/browser/prop"
import { backgroundColor } from "rokay/browser/style"
import { rafLoop } from "rokay/browser/visible"
import { last } from "rokay/data/array"
import { pick } from "rokay/math/random"
import { divide_, divideComponents_, eq, floor_, iter, len, minus, minus_, plus_, s, scale_, scaleComponents,
  unit, V, VZ } from "rokay/math/v"
import { derive } from "rokay/prop/derive"

import { Level } from "../../shared/levels/types.gen"
import { getMoves, THING_COOLDOWNS, THING_MOVEMENTS, THING_OFFSETS, THING_SPEEDS } from "../../shared/things/model"
import { Thing, ThingStateDying, ThingStateIdle, ThingStateMoveTo } from "../../shared/things/types.gen"
import { AppClient, GameSize } from "../app"
import { cellToPos, posToCell } from "../cells/utils"

import { WorldFM } from "./form-models.gen"


export const
  LEVEL_COLORS = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],

  WorldCanvas = (app: AppClient, levels: Level[], world: WorldFM) => {
    const
      getCameraOffset = (unicorn: Thing, level: Level, size: GameSize) =>
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
          unicorn.state = ThingStateMoveTo(path.map((cell) => cellToPos(app, cell)), 1)
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
            iter(VZ, minus(_level.size, V(1, 1)), (pos) => {
              if ((pos.x + pos.y) % 2 === 0) {
                ctx.fillRect(...s(scaleComponents(pos, _size.cell)), ...s(_size.cell))
              }
            })

            if (unicorn.state.t === "idle") {
              const COOLDOWN_OFFSET = Math.ceil(
                unicorn.state.cooldown / THING_COOLDOWNS.unicorn * _size.cell.y,
              )
              ctx.fillStyle = `rgba(255,255,255,${unicorn.state.cooldown > 0 ? ".25" : ".5"})`
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

            _level.things.sort((a, b) => a.pos.y - b.pos.y).forEach((thing) => {
              ctx.save()
              ctx.translate(Math.round(thing.pos.x), Math.round(thing.pos.y))
              ctx.scale(thing.scale.x, thing.scale.y)
              ctx.drawImage(app.assets[thing.t], ...(s(THING_OFFSETS[thing.t])))
              ctx.restore()
            })

            ctx.restore()
          },

          step = () => {
            const { things } = level.get()

            things.forEach((thing) => {
              if (thing.state.t === "idle") {
                if (thing.state.cooldown > 0) {
                  thing.state.cooldown -= 1 / 60
                } else if (thing.t === "pawn") {
                  const move = pick(thing.state.moves)
                  if (move != null) {
                    thing.cell = last(move)
                    thing.state = ThingStateMoveTo(
                      move.map((cell) => cellToPos(app, cell)),
                      THING_SPEEDS[thing.t],
                    )
                    thing.cell = last(thing.state.path)
                  }
                }
              } else if (thing.state.t === "moveTo") {
                let next = thing.state.path[0]
                thing.pos = plus_(
                  thing.pos,
                  scale_(unit(minus(next, thing.pos)), thing.state.speed),
                )
                const newCell = posToCell(app, thing.pos)
                if (!eq(thing.cell, newCell)) {
                  thing.cell = newCell
                  // we've entered the final square of the move, make the attack
                  if (thing.state.path.length === 1) {
                    things.forEach((otherThing) => {
                      if (thing === otherThing || otherThing.state.t === "dying") { return }
                      const thingCell = posToCell(app, otherThing.pos)
                      if (eq(newCell, thingCell)) { otherThing.state = ThingStateDying() }
                    })
                  }
                }
                if (len(minus(next, thing.pos)) < .5) {
                  thing.pos = next
                  thing.state.path = thing.state.path.slice(1)
                  if (thing.state.path.length === 0) {
                    thing.state = ThingStateIdle(THING_COOLDOWNS[thing.t], getMoves(
                      thing.cell,
                      THING_MOVEMENTS[thing.t],
                      level.get().size,
                    ))
                  }
                }
              }
            })

            // TODO: animate death
            level.get().things = things.filter((thing) => thing.state.t !== "dying")
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
