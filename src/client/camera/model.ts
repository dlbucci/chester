import { interpolateLinear, max, min, minus, plus, V, VZ } from "rokay/math/v"

import { Camera, CameraStateIdle } from "./types.gen"


export const
  /**
   * @returns the negated Camera position, respectful of focus and bounds
   **/
  cameraPos = (camera: Camera, pos = camera.pos) => {
    const result = max(
      minus(min(plus(minus(pos, camera.focus), camera.size), camera.bounds.se), camera.size),
      camera.bounds.nw,
    )
    return result
  },

  cameraStep = (dt: number, camera: Camera) => {
    if (camera.state.t === "follow") {
      camera.pos = cameraPos(camera, camera.state.thing.pos)
    } else if (camera.state.t === "easeTo") {
      camera.state.timeSec += dt
      if (camera.state.timeSec < camera.state.lengthSec) {
        camera.pos = interpolateLinear(camera.state.start, camera.state.end, ease(
          camera.state.timeSec / camera.state.lengthSec,
        ))
      } else {
        camera.pos = camera.state.end
        camera.state = CameraStateIdle()
      }
    }
  },

  cubicBezier = (a: V, b: V, frac: number) => {
    const ab = interpolateLinear(a, b, frac)
    return interpolateLinear(
      interpolateLinear(interpolateLinear(VZ, a, frac), ab, frac),
      interpolateLinear(ab, interpolateLinear(b, V(1, 1), frac), frac),
      frac,
    )
      .y
  },

  ease = (frac: number) =>
    cubicBezier(V(0.42, 0), V(0.58, 1), frac),

  linear = (a: number, b: number, f: number) =>
    a * (1 - f) + b * f
