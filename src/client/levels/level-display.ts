import { size as sizeAttr } from "rokay/browser/attr"
import { onDestroy } from "rokay/browser/capture"
import { apd } from "rokay/browser/core"
import { canvas, div } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { matchIf } from "rokay/browser/match"
import { onPointerdown } from "rokay/browser/on"
import { $ } from "rokay/browser/prop"
import { backgroundColor, border, imageRendering, position } from "rokay/browser/style"
import { rafLoop } from "rokay/browser/visible"
import { last } from "rokay/data/array"
import { float, int, pick } from "rokay/math/random"
import { divide, eq, floor, iter, len, minus, modulo, plus, round, scale, scaleComponents, T, unit, unitOfAng,
  V, VB, VZ } from "rokay/math/v"
import { Prop } from "rokay/prop/prop"

import { GameState, GameStateLevel } from "../../shared/games/types.gen"
import { Level } from "../../shared/levels/types.gen"
import { pgIndex, pgLevel, pgWin } from "../../shared/pages.gen"
import { getMoves, THING_STATS } from "../../shared/things/model"
import { ChessPiece, Thing, ThingStateDying, ThingStateIdle, ThingStateMoveTo } from "../../shared/things/types.gen"
import { World } from "../../shared/worlds/types.gen"
import { AppClient } from "../app"
import { getSprite } from "../assets"
import { cameraPos, cameraStep } from "../camera/model"
import { Camera, CameraStateEaseTo, CameraStateFollow, CameraStateIdle, CameraStateMobius } from "../camera/types.gen"
import { cellToPos, posToCell } from "../cells/utils"
import { GRAVITY, SIZE_BOARD, SIZE_BOARD_PIXELS, SIZE_CELL } from "../const"
import { CapturedBar } from "../elts/captured-bar"
import { LifeBar } from "../elts/life-bar"
import { $rainbowBackground } from "../elts/rainbow-background"
import { SONGS_BY_LEVEL } from "../sfx/music"
import { playBuffer } from "../sfx/sfx"
import { sfxChesterFadeIn, sfxChesterPieceBump, sfxChesterPieceSlide } from "../sfx/slide"
import { $flexCenter, $s100 } from "../style/utils.gen"
import { getTerrain, worldNew } from "../worlds/model"

import { bossIntro } from "./animes/boss-intro"
import { dead } from "./animes/dead"
import { Anime, AnimeGloverlay, AnimeStep } from "./animes/model"
import { postLevelWin } from "./animes/post-level-win"
import { preLevel } from "./animes/pre-level"
import { win, wintro } from "./animes/win"
import { LEVELS } from "./model"
import { FadeInOverlay, FlashInOverlay, FlashOutOverlay, TitleOverlay } from "./overlays"


export const
  LevelDisplay = (app: AppClient, gameState: Prop<GameState>) => {
    const
      animeEnd = () => {
        animes.set((_animes) => _animes.slice(1))
      },

      spawnEnemiesInitial = (level: Level, world: World) => {
        world.things = world.things.concat(level.spawnAreas.map((area) => {
          const cell = plus(area.pos, V(
            int(0, area.size.x - 1),
            SIZE_BOARD.y + int(0, area.size.y - 1),
          ))
          return Thing(
            "bad",
            cell,
            THING_STATS[area.type].frame,
            cellToPos(cell),
            V(1, 1),
            ThingStateIdle(THING_STATS[area.type].cooldown, []),
            area.type,
          )
        }))
      }

    let
      now = performance.now(),
      camera = Camera(
        { nw: VZ, se: scaleComponents(SIZE_BOARD, SIZE_CELL) },
        divide(SIZE_BOARD_PIXELS, 2),
        VZ,
        SIZE_BOARD_PIXELS,
        CameraStateMobius(V(0, SIZE_CELL.y), scale(SIZE_CELL, 2)),
      ),
      animes = Prop<Anime[]>(() => []),
      captured = Prop<Thing[]>(() => []),
      lifeUp = Prop(() => false),
      lives = Prop(() => 3),
      prevGameState = gameState.get()

    gameState.listenAndCall((_gameState) => {
      if (_gameState.t === "title") {
        animes.set(() =>
          prevGameState === _gameState ?
            []
          :
            [
              AnimeGloverlay(() =>
                FlashOutOverlay(1.5, prevGameState.t === "level" ? "#333" : "#fff", animeEnd)
              ),
            ]
        )
        camera.state = CameraStateMobius(V(0, SIZE_CELL.y), scale(SIZE_CELL, 2))
        captured.set(() => [])
        lives.set(() => 3)
      } else if (_gameState.t === "level") {
        camera.bounds.se = scaleComponents(_gameState.level.size, SIZE_CELL)
        camera.state = CameraStateFollow(_gameState.world.unicorn)
        const _prev = prevGameState
        animes.set(() => [
          ..._prev === _gameState ?
            []
          :
            [
              AnimeGloverlay(() =>
                FlashOutOverlay(1.5, _prev.t === "level" ? _prev.level.color : "#333", animeEnd)
              ),
            ],
          ...preLevel(
            _gameState.level,
            () => {
              camera.state = CameraStateEaseTo(
                cameraPos(camera, _gameState.world.unicorn.pos),
                1,
                camera.pos,
                0,
              )
            },
            () => {
              animeEnd()
              camera.state = CameraStateFollow(_gameState.world.unicorn)
              camera.bounds.se = scaleComponents(_gameState.level.size, SIZE_CELL)
              _gameState.world.unicorn.frame = 0
              spawnEnemiesInitial(_gameState.level, _gameState.world)
            },
          ),
        ])
        if (_gameState.level.index > 0) {
          onDestroy(playBuffer(SONGS_BY_LEVEL[_gameState.level.index - 1], { loop: true }))
        }
      } else if (_gameState.t === "win") {
        camera.bounds.se = SIZE_BOARD_PIXELS
        camera.state = CameraStateIdle()
        animes.set(() => [
          AnimeGloverlay(() => FlashOutOverlay(1.5, "#fff", animeEnd)),
          ...wintro(app, _gameState.world),
        ])
        onDestroy(playBuffer(SONGS_BY_LEVEL[6], { loop: true }))
      }
      prevGameState = _gameState
    })

    return div(
      $(gameState, (_gameState) =>
        $rainbowBackground(VB(35), _gameState.t === "title" ?
          0
        : _gameState.t === "win" ?
          7
        :
          _gameState.level.index)
      ),
      imageRendering("pixelated"),
      $flexCenter,
      $s100,
      apd(
        div(border("1px solid #333"), position("relative"), apd(
          LifeBar(app, lifeUp, lives, gameState),

          canvas(
            $(gameState, (_gameState) => backgroundColor(_gameState.t === "win" ?
              "#fff"
            : _gameState.t === "level" && _gameState.level.index > 3 ?
              "green"
            :
              "#555")),
            sizeAttr(...T(SIZE_BOARD_PIXELS)),

            onPointerdown((el, ev) => {
              const _gameState = gameState.get()
              const _anime = animes.get()[0]
              if (_gameState.t !== "level" || _anime != null) { return }

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

              unicorn.state = ThingStateMoveTo(
                path.map((cell) => cellToPos(cell)),
                THING_STATS.unicorn.speed,
              )
              playBuffer(sfxChesterPieceSlide)
              if (last(unicorn.state.path).x < unicorn.pos.x) {
                unicorn.scale.x = -1
              } else if (last(unicorn.state.path).x > unicorn.pos.x) {
                unicorn.scale.x = 1
              }
            }),

            withCtx((ctx) => {
              const
                collectFruit = (unicorn: Thing, world: World) => {
                  world.fruit.forEach((otherThing) => {
                    const thingCell = posToCell(otherThing.pos)
                    if (eq(unicorn.cell, thingCell)) {
                      otherThing.state = ThingStateDying(
                        0,
                        1,
                        scale(unitOfAng(float(-Math.PI * 3 / 8, -Math.PI * 5 / 8)), 100),
                        1,
                      )
                      captured.set((_captured) => {
                        const next = _captured.concat({ ...otherThing, alignment: "good" })
                        const _lifeUp = lifeUp.get()
                        if (next.length >= 8 && !_lifeUp) {
                          lives.set((_lives) => _lives + 1)
                          lifeUp.set(() => true)
                          setTimeout(
                            () => {
                              captured.set((_captured) => _captured.slice(8))
                              lifeUp.set(() => false)
                            },
                            5000,
                          )
                        }
                        return next
                      })
                    }
                  })
                  world.fruit = world.fruit.filter((fruit) => fruit.state.t !== "dying")
                },

                draw = () => {
                  const _gameState = gameState.get()

                  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                  ctx.save()
                  ctx.translate(...T(scale(
                    camera.shake == null ? camera.pos : plus(camera.pos, camera.shake.offset),
                    -1,
                  )))
                  const start = posToCell(
                    camera.shake != null ? plus(camera.pos, camera.shake.offset) : camera.pos,
                  )
                  iter(start, plus(start, SIZE_BOARD), (pos) => {
                    const
                      p = scaleComponents(pos, SIZE_CELL),
                      tp = T(p)
                    if (_gameState.t !== "win") {
                      const t = _gameState.t === "title" ?
                          "grass"
                        :
                          getTerrain(_gameState.world, pos)
                      if (t === "water") {
                        ctx.fillStyle = _gameState.t === "level" && _gameState.level.index > 4 ?
                            "blue"
                          :
                            "#555"
                        ctx.fillRect(...tp, ...T(SIZE_CELL))
                      }
                      if (t === "ice") {
                        ctx.fillStyle = _gameState.t === "level" && _gameState.level.index > 6 ?
                            "violet"
                          :
                            "#555"
                        ctx.fillRect(...tp, ...T(SIZE_CELL))
                      }
                      ctx.drawImage(
                        t === "grass" ?
                          app.assets.bgGrass
                        : t === "water" ?
                          app.assets.bgWater
                        :
                          app.assets.bgIce,
                        ...T(modulo(p, SIZE_BOARD_PIXELS)),
                        16,
                        16,
                        ...tp,
                        16,
                        16,
                      )
                    }
                    if ((pos.x + pos.y) % 2 === 0) {
                      ctx.fillStyle = "rgba(0,0,0,.125)"
                      ctx.fillRect(...tp, ...T(SIZE_CELL))
                    }
                  })

                  if (_gameState.t !== "title") {
                    const { crystals, fruit, things, unicorn } = _gameState.world
                    const _anime = animes.get()[0]
                    if (_gameState.t === "level" && _anime == null) {
                      if (unicorn.state.t === "idle") {
                        const COOLDOWN_OFFSET = Math.ceil(
                          unicorn.state.cooldown / THING_STATS.unicorn.cooldown * (SIZE_CELL.y - 4),
                        )
                        ctx.fillStyle = `rgba(255,255,255,${
                          unicorn.state.cooldown > 0 ? ".25" : ".5"
                        })`
                        unicorn.state.moves.forEach((path) => {
                          const move = last(path)
                          ctx.fillRect(
                            move.x * SIZE_CELL.x + 2,
                            move.y * SIZE_CELL.y + COOLDOWN_OFFSET + 2,
                            SIZE_CELL.x - 4,
                            SIZE_CELL.y - COOLDOWN_OFFSET - 4,
                          )
                        })
                      }
                    }

                    [...fruit, ...things].sort((a, b) => a.pos.y - b.pos.y).forEach((thing) => {
                      ctx.save()
                      ctx.translate(Math.round(thing.pos.x), Math.round(thing.pos.y))
                      if (thing.state.t === "dying") { ctx.rotate(thing.state.ang) }
                      ctx.scale(...T(thing.scale))
                      ctx.drawImage(
                        getSprite(app.assets, thing),
                        16 * thing.frame,
                        0,
                        16,
                        16,
                        -8,
                        -8,
                        16,
                        16,
                      )
                      ctx.restore()
                    })

                    crystals.sort((a, b) => a.pos.y - b.pos.y).forEach((crystal) => {
                      ctx.drawImage(crystal.sprite, ...T(round(crystal.pos)))
                    })
                  }

                  ctx.restore()
                },

                spawnBoss = ({ level, world }: GameStateLevel) => {
                  const bossCell = V(Math.floor(SIZE_BOARD.x / 2), 0)
                  world.boss = Thing(
                    "bad",
                    bossCell,
                    0,
                    cellToPos(bossCell),
                    V(1, 1),
                    ThingStateIdle(THING_STATS[level.bossName].cooldown, []),
                    level.bossName,
                  )
                  world.things = [...world.things, world.boss]
                },

                step = (dt: number) => {
                  const _gameState = gameState.get()
                  const _anime = animes.get()[0]
                  if (_anime != null) {
                    if (_anime.t === "step") { if (_anime.step(dt)) { animeEnd() } }
                  }
                  if (_gameState.t !== "title") {
                    const { world } = _gameState
                    const { boss, things, unicorn } = world
                    things.forEach((thing) => {
                      if (thing.state.t === "dying") {
                        if (thing.state.lifetime > 0) {
                          thing.state.lifetime -= dt
                          thing.state.vel = plus(thing.state.vel, scale(GRAVITY, dt))
                          thing.pos = plus(thing.pos, scale(thing.state.vel, dt))
                          thing.state.ang += thing.state.velAng * dt
                        }
                      }

                      // only update enemies if they are on screen
                      if (
                        thing !== unicorn
                        && thing !== boss
                        && (thing.cell.y < unicorn.cell.y - 5 || thing.cell.y > unicorn.cell.y + 3)
                      ) { return }

                      // keep the player animating
                      if (_anime != null && thing !== unicorn && thing !== world.tucker) { return }
                      if (
                        thing.alignment === "bad" && thing !== boss && boss?.state.t === "dying"
                      ) { return }
                      if (thing.state.t === "idle") {
                        if (
                          thing.type === "apple"
                          || thing.type === "banana"
                          || thing.type === "orange"
                          || thing === world.tucker
                        ) { return }
                        if (thing.state.cooldown > 0) {
                          thing.state.cooldown -= 1 / 60
                        } else if (_gameState.t === "level" && thing !== unicorn) {
                          const getNextMove = (thing: Thing) => {
                            const moves = getMoves(
                              thing,
                              boss != null ? SIZE_BOARD : _gameState.level.size,
                            )
                            if (thing.type === "pawn") {
                              return moves.find((move) =>
                                last(move).x !== thing.cell.x && eq(last(move), unicorn.cell)
                              ) ?? moves.find((move) =>
                                last(move).x === thing.cell.x && things.every((thing) =>
                                  !eq(last(move), thing.cell)
                                )
                              )
                            }
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
                        const terrain = getTerrain(world, thing.cell)
                        const d = minus(next, thing.pos)
                        const incr = dt * thing.state.speed * (
                          terrain === "water" ?
                            .5
                          : terrain === "ice" ?
                            1.5
                          :
                            1
                        )
                        thing.pos = len(d) < incr ? next : plus(thing.pos, scale(unit(d), incr))
                        const newCell = posToCell(thing.pos)
                        if (!eq(thing.cell, newCell)) {
                          thing.cell = newCell
                          // we've entered the final square of the move, make the attack
                          if (thing.state.path.length === 1) {
                            if (thing === unicorn) { collectFruit(unicorn, world) }
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
                                playBuffer(sfxChesterPieceBump)
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
                            && boss == null
                            && thing === unicorn
                            && thing.cell.y < SIZE_BOARD.y
                          ) {
                            spawnBoss(_gameState)
                            animes.set(() =>
                              bossIntro(app, camera, _gameState.level, () => {
                                animeEnd()
                              })
                            )
                          }
                        }
                        if (eq(next, thing.pos)) {
                          thing.pos = next
                          thing.state.path = thing.state.path.slice(1)
                          if (thing.state.path.length === 0) {
                            thing.state = ThingStateIdle(
                              THING_STATS[thing.type as ChessPiece]?.cooldown ?? 0,
                              _gameState.t === "level" && thing === unicorn ?
                                getMoves(thing, _gameState.level.size)
                              :
                                [],
                            )
                          } else {
                            //playBuffer(audioCtx, sfxChesterPieceSlide)
                          }
                        }
                      }
                    })

                    world.things = world.things.filter((thing) =>
                      thing.state.t !== "dying" || thing.state.lifetime > 0
                    )

                    if (
                      _gameState.t === "level"
                      && _anime == null
                      && boss != null
                      && !world.things.includes(boss)
                    ) {
                      animes.set((_animes) => {
                        if (_gameState.level.index + 1 < LEVELS.length) {
                          return postLevelWin(app, camera, _gameState, animeEnd, () => {
                            app.router.replace(
                              _gameState.level.index + 1 < LEVELS.length ?
                                pgLevel(_gameState.level.index + 1)
                              :
                                pgIndex(),
                            )
                          })
                        }
                        return win(app, world, () => {
                          app.router.replace(pgWin())
                        })
                      })
                    }
                    if (
                      _gameState.t === "level" && !world.things.includes(unicorn) && _anime == null
                    ) {
                      animes.set(() => dead(() => {
                        const _lives = lives.get()
                        if (_lives === 0) {
                          animes.set(() => [
                            AnimeGloverlay(() =>
                              FlashInOverlay(2.5, "#333", () => {
                                app.router.replace(pgIndex())
                              })
                            ),
                          ])
                          return
                        }
                        lives.set((_lives) => _lives - 1)
                        _gameState.world = worldNew(_gameState.level)
                        _gameState.world.unicorn.frame = 0
                        camera.state = CameraStateEaseTo(
                          cameraPos(camera, _gameState.world.unicorn.pos),
                          1,
                          camera.pos,
                          0,
                        )
                        animes.set(() => [
                          AnimeStep(() => {
                            if (camera.state.t !== "idle") { return }
                            camera.state = CameraStateFollow(_gameState.world.unicorn)
                            spawnEnemiesInitial(_gameState.level, _gameState.world)
                            return true
                          }),
                        ])
                      }))
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

          CapturedBar(app, captured, gameState, lifeUp),

          matchIf(gameState, (_gameState) =>
            _gameState.t === "title" ?
              TitleOverlay(() => {
                animes.set(() => [
                  AnimeGloverlay(() => {
                    playBuffer(sfxChesterFadeIn)
                    return FadeInOverlay(1.5, "#333", () => {
                      app.router.replace(pgLevel(0))
                    })
                  }),
                ])
              })
            :
              undefined
          ),

          matchIf(animes, (_animes) => {
            const _anime = _animes[0]
            return _anime?.t === "overlay" ? _anime.elt() : undefined
          }),
        )),
        matchIf(animes, (_animes) => {
          const _anime = _animes[0]
          return _anime?.t === "gloverlay" ? _anime.elt() : undefined
        }),
      ),
    )
  }
