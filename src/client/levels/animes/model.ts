import { Elt } from "rokay/browser/core"


export type Anime = AnimeGloverlay | AnimeOverlay | AnimeStep
export type AnimeGloverlay = {
  t: "gloverlay"
  elt(): Elt
}
export type AnimeOverlay = {
  t: "overlay"
  elt(): Elt
}
export type AnimeStep = {
  t: "step"
  /**
   * @returns true if the animation is done
   **/
  step(dt: number): boolean | undefined
}


export const
  AnimeGloverlay = (elt: () => Elt): AnimeGloverlay =>
    ({ t: "gloverlay", elt }),

  AnimeOverlay = (elt: () => Elt): AnimeOverlay =>
    ({ t: "overlay", elt }),

  AnimeStep = (step: (dt: number) => boolean | undefined): AnimeStep =>
    ({ t: "step", step })
