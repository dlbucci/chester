import { AppClient } from "./app"
import { LEVELS } from "./levels/model"
import { WorldFM } from "./worlds/form-models.gen"
import { WorldDisplay } from "./worlds/world-display"


export const
  IndexPage = (app: AppClient) => {
    const
      levels = LEVELS(app),
      world = WorldFM(0)
    return WorldDisplay(app, levels, world)
  }
