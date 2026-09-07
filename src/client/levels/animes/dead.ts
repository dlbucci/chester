import { AppClient } from "../../app"
import { DeadOverlay } from "../overlays"

import { Anime, AnimeOverlay } from "./model"


export const
  dead = (app: AppClient): Anime[] =>
    [AnimeOverlay(() => DeadOverlay(app))]
