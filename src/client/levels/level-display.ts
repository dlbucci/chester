import { size as sizeAttr } from "rokay/browser/attr"
import { apd } from "rokay/browser/core"
import { canvas, div } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { matchIf } from "rokay/browser/match"
import { onPointerdown } from "rokay/browser/on"
import { backgroundColor, color, height, left, position, top, width } from "rokay/browser/style"
import { rafLoop } from "rokay/browser/visible"
import { last } from "rokay/data/array"
import { float, pick } from "rokay/math/random"
import { divide, eq, floor, iter, len, minus, plus, scale, scaleComponents, T, unit, unitOfAng, V, VZ } from "rokay/math/v"
import { PropBasic } from "rokay/prop/basic"

import { Level, LevelStateBoss, LevelStatePlaying } from "../../shared/levels/types.gen"
import { getMoves, THING_COOLDOWNS, THING_MOVEMENTS, THING_OFFSETS, THING_SPEEDS } from "../../shared/things/model"
import { ThingStateDying, ThingStateIdle, ThingStateMoveTo } from "../../shared/things/types.gen"
import { AppClient } from "../app"
import { cameraPos, cameraStep } from "../camera/model"
import { Camera, CameraStateEaseTo, CameraStateFollow, CameraStateIdle } from "../camera/types.gen"
import { cellToPos, posToCell } from "../cells/utils"
import { GRAVITY, SIZE_BOARD, SIZE_BOARD_PIXELS, SIZE_CELL } from "../const"
import { LevelStateFM, LevelStatePreFM } from "../levels/form-models.gen"
import { $flexCenter, $levelPre } from "../style/utils.gen"


export const
  LEVEL_COLORS = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
  LEVEL_PRE_LIFETIME = 5,

  LevelDisplay = (app: AppClient, level: Level) => {
    const
      { boss, size, unicorn } = level,

      state = PropBasic<LevelStateFM>(LevelStatePreFM(LEVEL_PRE_LIFETIME))

    let
      now = performance.now(),
      { things } = level,
      camera = Camera(
        { nw: VZ, se: scaleComponents(size, SIZE_CELL) },
        divide(SIZE_BOARD_PIXELS, 2),
        VZ,
        SIZE_BOARD_PIXELS,
        CameraStateIdle(),
      )

    camera.state = CameraStateEaseTo(cameraPos(camera, unicorn.pos), 4, cameraPos(camera, VZ), 0)

    return div(position("relative"), apd(
      canvas(
        backgroundColor("red"),
        sizeAttr(...T(SIZE_BOARD_PIXELS)),
        onPointerdown((el, ev) => {
          const _state = state.get()
          if (_state.t !== "playing" && _state.t !== "boss") { return }
          if (unicorn.state.t !== "idle" || unicorn.state.cooldown > 0) { return }
          const _size = app.size.get()
          const src = floor(divide(
            minus(V(ev.clientX, ev.clientY), el.getBoundingClientRect()),
            _size.zoom,
          ))
          const pos = plus(src, camera.pos)
          const cell = posToCell(pos)
          const path = unicorn.state.moves.find((path) => eq(last(path), cell))
          if (path == null) { return }
          unicorn.state = ThingStateMoveTo(path.map((cell) => cellToPos(cell)), 1)
          if (last(unicorn.state.path).x < unicorn.pos.x) {
            unicorn.scale.x = -1
          } else if (last(unicorn.state.path).x > unicorn.pos.x) {
            unicorn.scale.x = 1
          }
        }),
        withCtx((ctx) => {
          const
            draw = () => {
              const _state = state.get()

              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
              ctx.save()
              ctx.translate(...T(scale(camera.pos, -1)))
              ctx.fillStyle = "rgba(0, 0, 0, .125)"
              iter(VZ, minus(size, V(1, 1)), (pos) => {
                if ((pos.x + pos.y) % 2 === 0) {
                  ctx.fillRect(...T(scaleComponents(pos, SIZE_CELL)), ...T(SIZE_CELL))
                }
              })

              if (_state.t === "playing" && unicorn.state.t === "idle") {
                const COOLDOWN_OFFSET = Math.ceil(
                  unicorn.state.cooldown / THING_COOLDOWNS.unicorn * SIZE_CELL.y,
                )
                ctx.fillStyle = `rgba(255,255,255,${unicorn.state.cooldown > 0 ? ".25" : ".5"})`
                unicorn.state.moves.forEach((path) => {
                  const move = last(path)
                  ctx.fillRect(
                    move.x * SIZE_CELL.x,
                    move.y * SIZE_CELL.y + COOLDOWN_OFFSET,
                    SIZE_CELL.x,
                    SIZE_CELL.y - COOLDOWN_OFFSET,
                  )
                })
              }

              things.sort((a, b) => a.pos.y - b.pos.y).forEach((thing) => {
                ctx.save()
                ctx.translate(Math.round(thing.pos.x), Math.round(thing.pos.y))
                if (thing.state.t === "dying") { ctx.rotate(thing.state.ang) }
                ctx.scale(...T(thing.scale))
                ctx.drawImage(app.assets[thing.t], ...T(THING_OFFSETS[thing.t]))
                ctx.restore()
              })

              ctx.restore()
            },

            step = (dt: number) => {
              const _state = state.get()
              if (_state.t === "pre") {
                _state.lifetime.set((_lifetime) => _lifetime - dt)
                if (_state.lifetime.get() <= 0) {
                  state.set(() => LevelStatePlaying())
                  camera.state = CameraStateFollow(unicorn)
                }
              } else if (_state.t === "boss" || _state.t === "playing") {
                things.forEach((thing) => {
                  if (thing === boss && _state.t !== "boss") { return }
                  if (thing.state.t === "dying") {
                    if (thing.state.lifetime > 0) {
                      thing.state.lifetime -= dt
                      thing.state.vel = plus(thing.state.vel, scale(GRAVITY, dt))
                      thing.pos = plus(thing.pos, scale(thing.state.vel, dt))
                      thing.state.ang += thing.state.velAng * dt
                    }
                  } else if (thing.state.t === "idle") {
                    if (thing.state.cooldown > 0) {
                      thing.state.cooldown -= 1 / 60
                    } else if (thing.t === "pawn") {
                      const move = pick(thing.state.moves)
                      if (move != null) {
                        thing.state = ThingStateMoveTo(
                          move.map((cell) => cellToPos(cell)),
                          THING_SPEEDS[thing.t],
                        )
                      }
                    }
                  } else if (thing.state.t === "moveTo") {
                    let next = thing.state.path[0]
                    thing.pos = plus(thing.pos, scale(
                      unit(minus(next, thing.pos)),
                      thing.state.speed,
                    ))
                    const newCell = posToCell(thing.pos)
                    if (!eq(thing.cell, newCell)) {
                      thing.cell = newCell
                      // we've entered the final square of the move, make the attack
                      if (thing.state.path.length === 1) {
                        things.forEach((otherThing) => {
                          if (thing === otherThing || otherThing.state.t === "dying") { return }
                          const thingCell = posToCell(otherThing.pos)
                          if (eq(newCell, thingCell)) {
                            otherThing.state = ThingStateDying(
                              0,
                              1,
                              scale(unitOfAng(float(-Math.PI * 3 / 8, -Math.PI * 5 / 8)), 100),
                              1,
                            )
                          }
                        })
                      }
                      if (
                        _state.t === "playing" && thing === unicorn && thing.cell.y < SIZE_BOARD.y
                      ) {
                        state.set(() => LevelStateBoss())
                        camera.state = CameraStateEaseTo(cameraPos(camera, VZ), 1, camera.pos, 0)
                      }
                    }
                    if (len(minus(next, thing.pos)) < .5) {
                      thing.pos = next
                      thing.state.path = thing.state.path.slice(1)
                      if (thing.state.path.length === 0) {
                        thing.state = ThingStateIdle(THING_COOLDOWNS[thing.t], getMoves(
                          thing.cell,
                          THING_MOVEMENTS[thing.t],
                          size,
                        ))
                      }
                    }
                  }
                })

                things = things.filter((thing) =>
                  thing.state.t !== "dying" || thing.state.lifetime > 0
                )
              }

              cameraStep(dt, camera)
            }

          rafLoop(app.visible, (n) => {
            step(Math.min((n - now) / 1000, 1 / 30))
            now = n
            draw()
          })
        }),
      ),
      matchIf(state, (_state) =>
        _state.t === "pre" ?
          div(
            color("#eee"),
            $flexCenter,
            $levelPre,
            position("absolute"),
            top(0),
            left(0),
            width("100%"),
            height("100%"),
            apd("Level ", level.meta.index + 1),
          )
        :
          undefined
      ),
    ))
  }
