import { Visible } from "rokay/browser/visible"
import { V } from "rokay/math/v"
import { PropView } from "rokay/prop/prop"
import { Router } from "rokay/route/router"

import { Assets } from "./assets.js"


export type AppClient = {
  assets: Assets
  router: Router
  size: PropView<
    {
      board: V
      cell: V
      size: V
      window: V
      zoom: number
      zoomedSize: V
    }
  >
  visible: Visible
}
