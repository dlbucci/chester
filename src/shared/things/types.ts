import { TypeADT, TypeArray, TypeInt, TypeNumber, TypeObject, TypeStringUnion } from "rokay/data/type"

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
  ],
  CHESS_PIECES = ["bishop", "king", "knight", "pawn", "queen", "rook"]


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
  ChessPiece = TypeStringUnion(CHESS_PIECES),

  ThingType = TypeStringUnion([...CHESS_PIECES, ...BOSS_NAMES, "unicorn"]),

  Thing = TypeObject({
    alignment: TypeStringUnion(["good", "bad"]),
    cell: V,
    frame: TypeInt(),
    pos: V,
    scale: V,
    state: ThingState,
    type: ThingType,
  })
