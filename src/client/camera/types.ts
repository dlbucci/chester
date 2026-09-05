import { opt, TypeADT, TypeNumber, TypeObject } from "rokay/data/type"

import { V } from "../../shared/maths/types"
import { Thing } from "../../shared/things/types"


export const
  CameraShake = TypeObject({
    magnitude: TypeNumber(),
    offset: V,
    timeSec: TypeNumber(),
  }),

  CameraState = TypeADT({
    easeTo: {
      end: V,
      start: V,
      timeSec: TypeNumber(),
      lengthSec: TypeNumber(),
    },
    follow: { thing: Thing },
    idle: {},
    mobius: { d: V, modulus: V },
  }),

  Camera = TypeObject({
    bounds: TypeObject({ nw: V, se: V }),
    focus: V,
    pos: V,
    shake: opt(CameraShake),
    size: V,
    state: CameraState,
  })
