import { size as sizeAttr } from "rokay/browser/attr"
import { apd } from "rokay/browser/core"
import { canvas, div } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { match, matchIf } from "rokay/browser/match"
import { onClick, onPointerdown } from "rokay/browser/on"
import { $ } from "rokay/browser/prop"
import { backgroundColor, border, height, position } from "rokay/browser/style"
import { rafLoop } from "rokay/browser/visible"
import { last, remove, tab } from "rokay/data/array"
import { float, pick } from "rokay/math/random"
import { divide, eq, floor, iter, len, minus, plus, round, scale, scaleComponents, T, unit, unitOfAng,
  V, VZ } from "rokay/math/v"
import { Prop } from "rokay/prop/prop"

import { GameState, GameStateDead, GameStateLevelBoss } from "../../shared/games/types.gen"
import { Level } from "../../shared/levels/types.gen"
import { getMoves, THING_STATS } from "../../shared/things/model"
import { Thing, ThingStateDying, ThingStateIdle, ThingStateMoveTo, ThingType } from "../../shared/things/types.gen"
import { World } from "../../shared/worlds/types.gen"
import { AppClient } from "../app"
import { getSprite } from "../assets"
import { cameraPos, cameraStep } from "../camera/model"
import { Camera, CameraStateEaseTo, CameraStateFollow, CameraStateIdle, CameraStateMobius } from "../camera/types.gen"
import { cellToPos, posToCell } from "../cells/utils"
import { GRAVITY, SIZE_BOARD, SIZE_BOARD_PIXELS, SIZE_CELL } from "../const"
import { $flexRow } from "../style/utils.gen"

import { bossIntro } from "./animes/boss-intro"
import { Anime } from "./animes/model"
import { postLevelWin } from "./animes/post-level-win"
import { LEVELS } from "./model"
import { DeadOverlay, LevelPreOverlay, TitleOverlay, WinOverlay } from "./overlays"


export const
  BG_COLORS_BY_LEVEL = tab(LEVELS.length, (i) => `hsl(123, ${i / (LEVELS.length - 1) * 78}%, 34%)`),
  LEVEL_PRE_LIFETIME = 5,

  LevelDisplay = (app: AppClient, gameState: Prop<GameState>) => {
    let
      now = performance.now(),
      camera = Camera(
        { nw: VZ, se: scaleComponents(SIZE_BOARD, SIZE_CELL) },
        divide(SIZE_BOARD_PIXELS, 2),
        VZ,
        SIZE_BOARD_PIXELS,
        gameState.get().t === "title" ?
          CameraStateMobius(V(0, SIZE_CELL.y), scale(SIZE_CELL, 2))
        :
          CameraStateIdle(),
      ),
      animes = Prop<Anime[]>(() => []),
      captured = Prop<Thing[]>(() => [])

    gameState.listenAndCall((_gameState) => {
      if (_gameState.t === "title") {
        camera.state = CameraStateMobius(V(0, SIZE_CELL.y), scale(SIZE_CELL, 2))
        captured.set(() => [])
        return
      }
      const { unicorn } = _gameState.world
      camera.bounds.se = scaleComponents(_gameState.level.size, SIZE_CELL)
      camera.state = _gameState.t === "levelPre" ?
          CameraStateEaseTo(cameraPos(camera, unicorn.pos), 1, camera.pos, 0)
        : _gameState.t === "level" ?
          CameraStateFollow(unicorn)
        :
          CameraStateIdle()
    })

    return div(border("1px solid #000"), position("relative"), apd(
      canvas(
        $(gameState, (_gameState) => backgroundColor(
          BG_COLORS_BY_LEVEL[_gameState.t === "title" ? 0 : _gameState.level.index] ?? "gray",
        )),
        sizeAttr(...T(SIZE_BOARD_PIXELS)),

        onPointerdown((el, ev) => {
          const _gameState = gameState.get()
          if (_gameState.t !== "level" && _gameState.t !== "levelBoss") { return }
          const { unicorn } = _gameState.world
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
            animeEnd = () => {
              animes.set((_animes) => _animes.slice(1))
            },

            draw = () => {
              const _gameState = gameState.get()

              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
              ctx.save()
              ctx.translate(...T(scale(
                camera.shake == null ? camera.pos : plus(camera.pos, camera.shake.offset),
                -1,
              )))
              ctx.fillStyle = "rgba(0, 0, 0, .125)"
              const start = posToCell(camera.pos)
              iter(start, plus(start, SIZE_BOARD), (pos) => {
                if ((pos.x + pos.y) % 2 === 0) {
                  ctx.fillRect(...T(scaleComponents(pos, SIZE_CELL)), ...T(SIZE_CELL))
                }
              })

              if (_gameState.t !== "title") {
                const { crystal, things, unicorn } = _gameState.world
                if (_gameState.t === "level" || _gameState.t === "levelBoss") {
                  if (unicorn.state.t === "idle") {
                    const COOLDOWN_OFFSET = Math.ceil(
                      unicorn.state.cooldown / THING_STATS.unicorn.cooldown * SIZE_CELL.y,
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
                }

                things.sort((a, b) => a.pos.y - b.pos.y).forEach((thing) => {
                  ctx.save()
                  ctx.translate(Math.round(thing.pos.x), Math.round(thing.pos.y))
                  if (thing.state.t === "dying") { ctx.rotate(thing.state.ang) }
                  ctx.scale(...T(thing.scale))
                  ctx.drawImage(getSprite(app.assets, thing), ...T(THING_STATS[thing.type].offset))
                  ctx.restore()
                })

                if (crystal != null) { ctx.drawImage(crystal.sprite, ...T(round(crystal.pos))) }
              }

              ctx.restore()
            },

            spawnEnemies = (dt: number, level: Level, { unicorn, things }: World) => {
              const y = unicorn.cell.y - SIZE_BOARD.y / 2 - 1
              if (y < SIZE_BOARD.y) { return }
              for (let i = 0; i < SIZE_BOARD.x; ++i) {
                for (const thing in level.spawnRates) {
                  const
                    type = thing as ThingType,
                    spawnTime = level.spawnRates[type],
                    odds = spawnTime === 0 ? 0 : 1 / spawnTime * dt / SIZE_BOARD.x
                  if (Math.random() > odds) { continue }
                  const cell = V(i, y)
                  things.push(Thing(
                    "bad",
                    cell,
                    cellToPos(cell),
                    V(1, 1),
                    ThingStateIdle(THING_STATS[type].cooldown, []),
                    type,
                  ))
                }
              }
            },

            step = (dt: number) => {
              const _gameState = gameState.get()
              const _anime = animes.get()[0]
              if (_anime != null) { if (_anime.t === "step") { _anime.step(dt) } }
              if (_gameState.t !== "title") {
                const { level, world } = _gameState
                const { boss, things, unicorn } = world
                if (_gameState.t === "level") { spawnEnemies(dt, level, world) }
                if (_gameState.t === "level" || _gameState.t === "levelBoss") {
                  things.forEach((thing) => {
                    if (thing === boss && _gameState.t !== "levelBoss") { return }
                    // keep the player animating
                    if (_anime != null && thing !== unicorn) { return }
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
                      } else if (thing !== unicorn) {
                        const getNextMove = (thing: Thing) => {
                          const moves = getMoves(
                            thing,
                            _gameState.t === "levelBoss" ? SIZE_BOARD : level.size,
                          )

                          return (
                              thing.alignment === "bad" ?
                                moves.find((move) => eq(last(move), unicorn.cell))
                              :
                                undefined
                            )
                            ?? moves.find((move) =>
                              things.some((enemy) =>
                                enemy.alignment !== thing.alignment && eq(last(move), enemy.cell)
                              )
                            )
                            ?? pick(moves.filter((move) =>
                              things.every((enemy) =>
                                enemy.alignment !== thing.alignment || !eq(last(move), enemy.cell)
                              )
                            ))
                            ?? pick(moves)
                        }

                        const move = getNextMove(thing)
                        if (move != null) {
                          thing.state = ThingStateMoveTo(
                            move.map((cell) => cellToPos(cell)),
                            THING_STATS[thing.type].speed,
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
                              if (thing === unicorn) {
                                captured.set((_captured) =>
                                  _captured.concat({ ...otherThing, alignment: "good" })
                                )
                              }
                            }
                          })
                        }
                        if (
                          _gameState.t === "level"
                          && thing === unicorn
                          && thing.cell.y < SIZE_BOARD.y
                        ) {
                          animes.set(() =>
                            bossIntro(app, camera, level, animeEnd, () => {
                              animeEnd()
                              gameState.set(() => GameStateLevelBoss(level, world))
                            })
                          )
                        }
                      }
                      if (len(minus(next, thing.pos)) < .5) {
                        thing.pos = next
                        thing.state.path = thing.state.path.slice(1)
                        if (thing.state.path.length === 0) {
                          thing.state = ThingStateIdle(
                            THING_STATS[thing.type].cooldown,
                            thing === unicorn ? getMoves(thing, level.size) : [],
                          )
                        }
                      }
                    }
                  })

                  world.things = things.filter((thing) =>
                    thing.state.t !== "dying" || thing.state.lifetime > 0
                  )

                  if (_anime == null && !things.includes(boss)) {
                    animes.set((_animes) =>
                      postLevelWin(app, camera, gameState, _gameState, animeEnd)
                    )
                  }
                  if (!things.includes(unicorn)) {
                    gameState.set(() => GameStateDead(level, world))
                  }
                }
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

      div(backgroundColor("gray"), height("16px"), apd(match(captured, (_captured) =>
        div($flexRow, apd(..._captured.map((thing) =>
          canvas(
            sizeAttr(16, 16),
            withCtx((ctx) => {
              ctx.drawImage(getSprite(app.assets, thing), 0, 0)
            }),
            onClick(() => {
              const _gameState = gameState.get()
              if (_gameState.t === "level" || _gameState.t === "levelBoss") {
                const { world } = _gameState
                const cell = minus(world.unicorn.cell, V(0, 1))
                world.things.push(Thing(
                  "good",
                  cell,
                  cellToPos(cell),
                  V(1, 1),
                  ThingStateIdle(1.5, []),
                  thing.type,
                ))
                captured.set((_captured) => remove(_captured, thing))
              }
            }),
          )
        )))
      ))),

      matchIf(gameState, (_gameState) => {
        // : _gameState.t === "levelWin" ?
        //   LevelWinOverlay(app, _gameState.level, {
        //     onClick() { gameState.set(() => GameStateWin(_gameState.level, _gameState.world)) },
        //   })
        return _gameState.t === "title" ?
            TitleOverlay(app)
          : _gameState.t === "levelPre" ?
            LevelPreOverlay(_gameState, gameState)
          : _gameState.t === "win" ?
            WinOverlay(app)
          : _gameState.t === "dead" ?
            DeadOverlay(app)
          :
            undefined
      }),

      matchIf(animes, (_animes) => {
        const _anime = _animes[0]
        return _anime?.t === "overlay" ? _anime.elt() : undefined
      }),
    ))
  }
