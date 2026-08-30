import { TypeADT, TypeArray, TypeNumber, TypeObject, TypeStringUnion } from "rokay/data/type"

import { V } from "../maths/types"


const
  BOSS_NAMES = [
    "Rebu",
    "Barbin",
    "Halsik",
    "Sicafant",
    "Peanio",
    "Dinkus",
    "Boof Cake",
    "Evernut Clapati",
  ]


export const
  ThingState = TypeADT({
    dying: {
      ang: TypeNumber(),
      lifetime: TypeNumber(),
      vel: V,
      velAng: TypeNumber(),
    },
    idle: { cooldown: TypeNumber(), moves: TypeArray(TypeArray(V)) },
    moveTo: { path: TypeArray(V), speed: TypeNumber() },
  })

export const
  BossName = TypeStringUnion(BOSS_NAMES),

  ThingType = TypeStringUnion([
    "bishop",
    "king",
    "knight",
    "pawn",
    "queen",
    "rook",
    "unicorn",
    ...BOSS_NAMES,
  ]),

  Thing = TypeObject({
    cell: V,
    pos: V,
    scale: V,
    state: ThingState,
    type: ThingType,
  })
