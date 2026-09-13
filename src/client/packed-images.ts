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
  ALPHABET = unpack(
    1,
    290,
    8,
    [0xff000000],
    "ZxnPeZLgpQ/JnGcZ+UYxj4EACAwEIChAAAAAACAAAAAAAgyAJSlKEJSQKUK6lKUpElGMYiBAAgQBAAIQAAAAAAgAAAAAAISgCUoShCEkCpCupSlKBJRqpQucY5kHcgKUPcZx3HelGMZeACAgQlyEoQh5AsQraUpSYSUakIQUpSlCUoCpCspSlKCJRqqQgAgIAPShLnLSQKkK2lyXBElGqiIdKEuclKAsQrKUpQYiUakkwAIMACUpShCUkSlCspQtKRJKrEkJSlKEHSgKkKylx0BIkqqnQAAAAQlxnPQdLjJerJkHSYRhFRJ53GOZAUoSlCsmQFDhmEVEXoQggAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADAAAAEBAAAAAA4CAAAAA=",
  ),

  CRYSTAL = unpack(
    2,
    16,
    16,
    [0xff0000e0, 0xff0000c4, 0xff0000ff],
    "AAAAAAABgAAABaAAABWoAACX6QAAr/UAAK/1AACv9QAAr/UAAK/1AACv9QAAl+kAABWoAAAFoAAAAYAAAAAAAA==",
  ),

  FRUIT = unpack(
    3,
    24,
    8,
    [0xff000000, 0xff00a5ff, 0xff0000ff, 0xff00ffff, 0xff00e0e0, 0xff0091e0, 0xff0000e0],
    "AAIAAAAJASSADbLYAAEkCSSQbbbbAAklSKSWbbbfAEllSSSWbbbfEkslSSS2Dbb4klklSSS2Dbb4EskoCS2wAffAAEtAA22A",
  ),

  PIECES = unpack(
    1,
    96,
    16,
    [0xff222222],
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAYAAgACAAYAD4B24A8AIkACAA8AH4B24AYAMsB24A8AHcB/4A8AlpCPEAYAP8B/4B8A37CJEA8AP+B/4B6Af+CJEA8APeAAAD7Af+CJEB+AfMA/wD3AduB54D/AfgA/wD3AP8A/wD/AfgA/wD/AP8A/wA8AfwA/wB+AP8A/wAAAfwAAAA8AH4APAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  ),

  UNICORN = unpack(
    3,
    32,
    16,
    [0xff00ffff, 0xffffffff, 0xffddcccc, 0xff00e0e0, 0xff000000, 0xffe0e0e0, 0xffc2b3b3],
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAACcAAAAAAAAAAAAAAaSAAAAAAAAAAAAAAaqVAAAAAAAAAAAAAaSVAAAAAAAAAAAAAaWAAAAAAbbAAAAaSSSAAAaSSSSYAADSSSSAADSSSSSSAADSSSWAADSSSSWTAAYQwCGAADQwCGSUAAAQwCGAAAQwCGSAIAAY4DHAAAY4DHtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  )
