import { size as sizeAttr } from "rokay/browser/attr"
import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { background, position, zIndex } from "rokay/browser/style"
import { V } from "rokay/math/v"


export const
  RainbowBackground = (size: V, colors: number, saturation: number) => {
    return canvas(position("absolute"), sizeAttr(size.x, size.y), zIndex(-1), withCtx((ctx) => {
      for (let y = 0; y < size.y; ++y) {
        const hue = Math.round(Math.floor(y / size.y * colors) * 360 / colors)
        ctx.fillStyle = `hsl(${hue}, ${saturation * 100}%, 50%)`
        for (let x = 0; x < size.x; ++x) {
          ctx.fillRect(x, (y - x + size.y) % size.y, 1, 1)
        }
      }
    }))
  },

  $rainbowBackground = (
    size: V,
    colors: number,
    saturation: number,
  ) =>
    background(
      `${size.x}px ${size.y}px repeat url(${RainbowBackground(size, colors, saturation).toDataURL()})`,
    )
