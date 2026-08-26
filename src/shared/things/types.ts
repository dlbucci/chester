import { TypeADT, TypeArray, TypeNumber } from "rokay/data/type"

import { V } from "../maths/types"


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


const
  chessPieceAttrs = {
    cell: V,
    pos: V,
    scale: V,
    state: ThingState,
  }


export const
  Thing = TypeADT({
    bishop: chessPieceAttrs,
    king: chessPieceAttrs,
    knight: chessPieceAttrs,
    pawn: chessPieceAttrs,
    queen: chessPieceAttrs,
    rook: chessPieceAttrs,
    unicorn: chessPieceAttrs,
  })
