import { V } from "rokay/math/v"
import { PropView } from "rokay/prop/prop"
import { Router } from "rokay/route/router"

import { Assets } from "./assets.js"


export type GameSize = {
  /**
   * the size of the board visible on screen in cells
   **/
  board: V
  /**
   * the size of a cell in pixels
   **/
  cell: V
  /**
   * half the size of a cell in pixels
   **/
  cellHalf: V
  /**
   * the size of the board in pixels
   **/
  size: V
  /**
   * the size of the window
   **/
  window: V
  /**
   * the zoom for the board
   **/
  zoom: number
  /**
   * the size of the board * zoom in pixels
   **/
  zoomedSize: V
}

export type AppClient = {
  assets: Assets
  router: Router
  size: PropView<GameSize>
  visible: PropView<boolean>
}
