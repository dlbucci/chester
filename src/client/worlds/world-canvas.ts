import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { onPointerdown } from "rokay/browser/on"
import { $ } from "rokay/browser/prop"
import { backgroundColor } from "rokay/browser/style"
import { rafLoop } from "rokay/browser/visible"
import { last } from "rokay/data/array"
import { pick } from "rokay/math/random"
import { divide_, divideComponents_, eq, floor_, iter, len, minus, minus_, plus_, scale_, unit, V, VZ } from "rokay/math/v"
import { derive } from "rokay/prop/derive"

import { Level } from "../../shared/levels/types.gen"
import { getMoves, KNIGHT_MOVEMENTS, PAWN_MOVEMENTS, THING_COOLDOWNS, THING_SPEEDS } from "../../shared/things/model"
import { ThingPawn, ThingStateDying, ThingStateIdle, ThingStateMoveTo } from "../../shared/things/types.gen"
import { Unicorn, UnicornStateIdle, UnicornStateMoveTo } from "../../shared/unicorns/types.gen"
import { AppClient, GameSize } from "../app"
import { cellToPos, posToCell } from "../cells/utils"
import { LEVELS } from "../levels/model"
import { UNICORN_COOLDOWN_SEC, UNICORN_OFFSET } from "../unicorn/model"

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

            const things: (Unicorn | ThingPawn)[] = [unicorn, ..._level.things].sort((a, b) =>
              a.pos.y - b.pos.y
            )
            things.forEach((thing) => {
              ctx.save()
              ctx.translate(Math.round(thing.pos.x), Math.round(thing.pos.y))
              ctx.scale(thing.scale.x, thing.scale.y)
              if ("t" in thing) {
                ctx.drawImage(app.assets[thing.t], -UNICORN_OFFSET.x, -UNICORN_OFFSET.y + 2)
              } else {
                ctx.drawImage(app.assets.unicorn, -UNICORN_OFFSET.x, -UNICORN_OFFSET.y + 2)
              }
              ctx.restore()
            })

            ctx.restore()
          },

          step = () => {
            const { things, unicorn } = level.get()
            if (unicorn.state.t === "idle" && unicorn.state.cooldown > 0) {
              unicorn.state.cooldown -= 1 / 60
            } else if (unicorn.state.t === "moveTo") {
              let next = unicorn.state.path[0]
              const oldCell = posToCell(app, unicorn.pos)
              unicorn.pos = plus_(unicorn.pos, scale_(
                unit(minus(next, unicorn.pos)),
                unicorn.state.speed,
              ))
              const newCell = posToCell(app, unicorn.pos)
              if (!eq(oldCell, newCell) && eq(unicorn.cell, newCell)) {
                things.forEach((thing) => {
                  if (thing.state.t === "dying") { return }
                  const thingCell = posToCell(app, thing.pos)
                  if (eq(newCell, thingCell)) { thing.state = ThingStateDying() }
                })
              }
              if (len(minus(next, unicorn.pos)) < .5) {
                unicorn.pos = next
                unicorn.state.path = unicorn.state.path.slice(1)
                if (unicorn.state.path.length === 0) {
                  unicorn.state = UnicornStateIdle(UNICORN_COOLDOWN_SEC, getMoves(
                    unicorn.cell,
                    KNIGHT_MOVEMENTS,
                    level.get().size,
                  ))
                }
              }
            }

            things.forEach((thing) => {
              if (thing.state.t === "idle") {
                if (thing.state.cooldown > 0) {
                  thing.state.cooldown -= 1 / 60
                } else {
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
                      PAWN_MOVEMENTS,
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
