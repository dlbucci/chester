import { tab } from "rokay/data/array"
import { V } from "rokay/math/v"

import { Level, SpawnArea } from "../../shared/levels/types.gen"
import { BossName } from "../../shared/things/types.gen"
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
  }),

  Level2 = (bossName: BossName, color: string, preamble: string, areas: SpawnArea[]): Level => {
    const sizeY = areas.reduce((max, v) => Math.max(max, v.pos.y + v.size.y), 0) + 2 * SIZE_BOARD.y
    return Level(
      bossName,
      color,
      ++i,
      preamble.split("\n"),
      V(SIZE_BOARD.x, sizeY),
      areas,
      spawnRates({}),
    )
  }


let
  i = -1


export const
  UNICORN_WIN_PATH = [V(1, 4), V(1, 5), V(2, 5), V(3, 5)],
  TUCKER_WIN_PATH = UNICORN_WIN_PATH.map((v) => V(SIZE_BOARD.x - 1 - v.x, v.y)),

  LEVELS = [
    Level2(
      "Rebu",
      "red",
      `You're looking for something, aren't you?
Someone, perhaps?
Where should you go, little pony?
Seek out the wise Rebu.
He will get you where you need to be.
Now wake up.`,
      [...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "pawn"))],
    ),
    Level2(
      "Barbin",
      "orange",
      `What's this?
Rebu was no help to you?
What a shame.
Perhaps the mighty Barbin will help instead.`,
      [
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "knight")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "pawn")),
      ],
    ),
    Level2(
      "Halsik",
      "yellow",
      `Oh?
Barbin was no help either?
Huh. Weird.
Surely, the cunning Halsik can help your cause.
I'd bet my life on it.`,
      [
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "bishop")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "knight")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "pawn")),
      ],
    ),
    Level2(
      "Sicafant",
      "green",
      `Really?
Really?!
'Cause I gotta be honest:
I sorta expected the first two would be no help.
But Halsik?
Really?
Maybe just go talk to Sicafant?
He's a big fan of these guys, he'll know what's up.`,
      [
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "rook")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "bishop")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "knight")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "pawn")),
      ],
    ),
    Level2(
      "Peanio",
      "blue",
      `Sheesh, what a psycho.
At least the weather's clearing up.
You should talk to Peanio.
They know everything.
They'll be able to explain what's going on.`,
      [
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "queen")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "rook")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "bishop")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "knight")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "pawn")),
      ],
    ),
    Level2(
      "Dinkus",
      "indigo",
      `...
I got nothing, man.
You know, I'm really starting to thing that all these unicorns are assholes.
You could try Dinkus,
but uh... well, you get it.`,
      [
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "king")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "queen")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "rook")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "bishop")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "knight")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "pawn")),
      ],
    ),
    Level2(
      "Boof Cake",
      "violet",
      `Look, this has been a bit of a bust.
But on the bright side:
The world?
Really, where'd all this color come from?
Go kick Boof Cake's ass, maybe it'll keep coming!`,
      [
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "king")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "queen")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "rook")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "bishop")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "knight")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "pawn")),
      ],
    ),
    Level2(
      "Evernut Clapati",
      "black",
      `Hey, you did it!
And look at this place!
Look at all the pretty colors!
Those asshole unicorns had just hoarded it all for themselves, didn't they?
Good work, man! Quality stuff!
That said, there's one final thing to wrap up:
The true source of power for all you've faced...`,
      [
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "king")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "queen")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "rook")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "bishop")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "knight")),
        ...tab(4, (i) => SpawnArea(V(0, 2 * i), V(SIZE_BOARD.x, 2), "pawn")),
      ],
    ),
  ]


// !',.0123456789:?ABCDEGHILMNOPQRSTUWYabcdefghijklmnoprstuvwxy
