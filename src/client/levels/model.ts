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

    Rebu: 0,
    Barbin: 0,
    Halsik: 0,
    Sicafant: 0,
    Peanio: 0,
    Dinkus: 0,
    "Boof Cake": 0,
    "Evernut Clapati": 0,

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
Seek out the wise Rebu.
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
Perhaps the mighty Barbin will help instead.`.split(
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
      `Sheesh, what a psycho.
At least the weather's clearing up.
You should talk to Peanio.
They know everything.
They'll be able to explain what's going on.`.split(
          "\n",
        ),
      V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y),
      spawnRates({}),
    ),
    Level(
      "Dinkus",
      ++i,
      `...
I got nothing, man.
You know, I'm really starting to thing that all these unicorns are assholes.
You could try Dinkus,
but uh... well, you get it.`.split(
          "\n",
        ),
      V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y),
      spawnRates({}),
    ),
    Level(
      "Boof Cake",
      ++i,
      `Look, this has been a bit of a bust.
But on the bright side:
The world?
Really, where'd all this color come from?
Go kick Boof Cake's ass, maybe it'll keep coming!`.split(
          "\n",
        ),
      V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y),
      spawnRates({}),
    ),
    Level(
      "Evernut Clapati",
      ++i,
      `Hey, you did it!
And look at this place!
Look at all the pretty colors!
Those asshole unicorns had just hoarded it all for themselves, didn't they?
Good work, man! Quality stuff!
That said, there's one final thing to wrap up:
The true source of power for all you've faced...`.split(
          "\n",
        ),
      V(SIZE_BOARD.x, (3 + i) * SIZE_BOARD.y),
      spawnRates({}),
    ),
  ]
