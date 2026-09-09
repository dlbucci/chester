import { size as sizeAttr } from "rokay/browser/attr"
import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { background, position, zIndex } from "rokay/browser/style"
import { V } from "rokay/math/v"

import { LEVELS } from "../levels/model"


export const
  RainbowBackground = (size: V, levels: number) =>
    canvas(position("absolute"), sizeAttr(size.x, size.y), zIndex(-1), withCtx((ctx) => {
      for (let y = 0; y < size.y; ++y) {
        const level = Math.floor(y / size.y * (LEVELS.length - 1))
        ctx.fillStyle = level < levels ? LEVELS[level].color : "#777"
        for (let x = 0; x < size.x; ++x) {
          ctx.fillRect(x, (y - x + size.y) % size.y, 1, 1)
        }
      }
    })),

  $rainbowBackground = (size: V, levels: number) =>
    background(`${size.x}px ${size.y}px repeat url(${RainbowBackground(size, levels).toDataURL()})`)
