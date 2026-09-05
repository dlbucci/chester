import { Elt } from "rokay/browser/core"


export type Anime = AnimeOverlay | AnimeStep
export type AnimeOverlay = {
  t: "overlay"
  elt(): Elt
}
export type AnimeStep = {
  t: "step"
  step(dt: number): void
}


export const
  AnimeOverlay = (elt: () => Elt): AnimeOverlay =>
    ({ t: "overlay", elt }),

  AnimeStep = (step: (dt: number) => void): AnimeStep =>
    ({ t: "step", step })
