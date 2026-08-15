import { Visible } from "rokay/browser/visible"
import { V } from "rokay/math/v"
import { PropView } from "rokay/prop/prop"

import { App } from "../shared/app.js"

import { Assets } from "./assets.js"


export type AppClient =
  & App
  & {
    assets: Assets
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
