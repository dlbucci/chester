import { User } from "okay-site-login/shared/users/types.gen"
import { Asink } from "rokay/prop/async"
import { ServerRouter } from "rokay/server/router"
import { RokayRequest } from "rokay/server/server"

import { App } from "../shared/app.js"


export type AppServer = App & {
  cspNonce: string
}


export const
  AppServer = (req: RokayRequest, user: User): AppServer => ({
    cspNonce: req.cspNonce,
    router: ServerRouter(req),
    user: Asink({ data: user }),
  })
