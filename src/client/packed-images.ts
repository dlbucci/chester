import { size } from "rokay/browser/attr"
import { canvas } from "rokay/browser/elt"
import { withCtx } from "rokay/browser/game/danvas"
import { size as sizeStyle } from "rokay/browser/style"


const
  unpack = (bitDepth: number, width: number, height: number, colors: number[], data: string) => {
    const bytes = Uint8Array.from(atob(data).split("").map((c) => c.charCodeAt(0)))

    return canvas(size(width, height), sizeStyle(width * 8 + "px", height * 8 + "px"), withCtx(
      (ctx) => {
        const
          imageData = new ImageData(width, height),
          { data } = imageData,
          uint32Data = new Uint32Array(data.buffer),
          bitMask = ((1 << bitDepth) - 1) << (8 - bitDepth)
        let
          bitIndex = 0,
          index32 = 0
        for (let byteIndex = 0; byteIndex < bytes.length; ++byteIndex) {
          const byte = (bytes[byteIndex] << 8) | (bytes[byteIndex + 1] ?? 0)
          while (true) {
            const index = (((byte >> (8 - bitIndex)) & bitMask) >> (8 - bitDepth)) - 1
            uint32Data[index32++] = colors[index]
            const brk = bitIndex + bitDepth >= 8
            bitIndex = (bitIndex + bitDepth) % 8
            if (brk) { break }
          }
        }
        ctx.putImageData(imageData, 0, 0)
      },
    ))
  }


export const
  CRYSTAL = unpack(
    2,
    16,
    16,
    [0xff0000e0, 0xff0000c4, 0xff0000ff],
    "AAAAAAABgAAABaAAABWoAACX6QAAr/UAAK/1AACv9QAAr/UAAK/1AACv9QAAl+kAABWoAAAFoAAAAYAAAAAAAA==",
  ),

  PIECES = unpack(
    1,
    96,
    16,
    [0xff222222],
    "AAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAACgAagAsAAAACAAYADgAfgA8AIkACAA8AD4AfgA8AMsB24A8AD4APAAYAmpD/8AYABgAPAAYA37D/8A8ADwAPAAYAf+D/8A8ADwAPAA8Af+D/8B+AH4AfgA8Af+B/4D/AP8AfgB+AP8A/wD/AP8A/wD/AP8A/wA8ADwA/wD/AP8A/wAAAAAAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  ),

  UNICORN = unpack(
    3,
    32,
    16,
    [0xff00ffff, 0xffddcccc, 0xffffffff, 0xff000000, 0xffe0e0e0, 0xffc2b3b3],
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAACRAAAAAAAAAAAAAATbAAAAAAAAAAAAAATjcAAAAAAAAAAAAATbcAAAAAAAAAAAAATdAAAAAASSAAAATbbbAAATbbbbQAACbbbbAACbbbbbaAACbbbdAACbbbbdaAAQYoDFAACYoDFbaAAAYoDFAAAYoDFbAAAAQwCGAAAQwCGkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  )
