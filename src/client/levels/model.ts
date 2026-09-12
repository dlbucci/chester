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

    ...rates,
  })


let
  i = -1


export const
  UNICORN_WIN_PATH = [V(1, 4), V(1, 5), V(2, 5), V(3, 5)],
  TUCKER_WIN_PATH = UNICORN_WIN_PATH.map((v) => V(SIZE_BOARD.x - 1 - v.x, v.y)),

  LEVELS = [
    Level(
      "Rebu",
      "red",
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
      "orange",
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
      "yellow",
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
      "green",
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
      "blue",
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
      "indigo",
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
      "violet",
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
      "black",
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
      V(SIZE_BOARD.x, (3) * SIZE_BOARD.y),
      spawnRates({}),
    ),
  ]
