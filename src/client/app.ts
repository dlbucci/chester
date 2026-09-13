import { V } from "rokay/math/v"
import { PropView } from "rokay/prop/prop"

import { Assets } from "./assets.js"


export type GameSize = {
  /**
   * the size of the window. UNUSED
   **/
  window: V
  /**
   * the size of the window before zooming
   **/
  windowUnzoomed: V
  /**
   * the zoom for the board
   **/
  zoom: number
  /**
   * the size of the board * zoom in pixels. UNUSED
   **/
  zoomedSize: V
}

export type AppClient = {
  assets: Assets
  size: PropView<GameSize>
  visible: PropView<boolean>
}
