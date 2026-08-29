import { V } from "rokay/math/v"

import { Level } from "../../shared/levels/types.gen"
import { SIZE_BOARD } from "../const"


const
  spawnRates = (rates: Partial<Level["spawnRates"]>): Level["spawnRates"] => ({
    bishop: 8,
    king: 8,
    knight: 8,
    pawn: 8,
    queen: 8,
    rook: 8,
    unicorn: 0,
    ...rates,
  })


let
  i = -1


export const
  LEVELS = [
    Level(
      "Rebu",
      ++i,
      `You're looking for something, aren't you?
Someone, perhaps?
Where should you go, little pony?
Seek out wise Rebu.
He will get you where you need to be.
Now wake up.`.split(
          "\n",
        ),
      V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y),
      spawnRates({}),
    ),
    Level(
      "Barbin",
      ++i,
      `What's this?
Rebu was no help to you?
What a shame.
Perhaps strong Barbin will help instead.`.split(
          "\n",
        ),
      V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y),
      spawnRates({}),
    ),
    Level(
      "Halsik",
      ++i,
      `Oh?
Barbin was no help either?
Huh. Weird.
Surely, the cunning Halsik can help your cause.
I'd bet my life on it.`.split(
          "\n",
        ),
      V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y),
      spawnRates({}),
    ),
    Level(
      "Sicafant",
      ++i,
      `Really?
Really?!
'Cause I gotta be honest:
I sorta expected the first two would be no help.
But Halsik?
Really?
Maybe just go talk to Sicafant?
He's a big fan of these guys, he'll know what's up.`.split(
          "\n",
        ),
      V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y),
      spawnRates({}),
    ),
    Level(
      "Peanio",
      ++i,
      `Okay, this one was my bad.
As soon as I sent you on your way, I thought "wait, this guy's gonna be an asshole too".
But you had already started out, and you just looked so confident.
I didn't want to ruin it for you.
That's my bad.
You should talk to Peanio.
They know everything.
They'll be able to explain what's going on.`.split(
          "\n",
        ),
      V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y),
      spawnRates({}),
    ),
    Level("Dinkus", ++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level("Boof Cake", ++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
    Level("Evernut Clapati", ++i, ["TODO"], V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y), spawnRates({})),
  ]
