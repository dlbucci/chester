import { V } from "rokay/math/v"
import { PropView } from "rokay/prop/prop"
import { Router } from "rokay/route/router"

import { Assets } from "./assets.js"


export type GameSize = {
  board: V
  cell: V
  size: V
  window: V
  zoom: number
  zoomedSize: V
}

export type AppClient = {
  assets: Assets
  router: Router
  size: PropView<GameSize>
  visible: PropView<boolean>
}
