import { MixArgs } from "rokay/mix"
import { charset, lang } from "rokay/server/attr"
import { apd, Elt } from "rokay/server/core"
import { body, head, html, meta, title, _meta } from "rokay/server/elt"

import { AppServer } from "./app.js"
import { staticFiles } from "./static.gen"


export const
  HTML = ({ cspNonce, user }: AppServer, ...args: MixArgs<Elt>) =>
    html(lang("en"), apd(
      head(apd(
        title(apd("Unicorn")),

        _meta(charset("utf-8")),
        meta("apple-mobile-web-app-capable", "yes"),
        meta("format-detection", "telephone=no"),
        meta("theme-color", "#dde"),
        meta("viewport", "initial-scale=1,user-scalable=no,width=device-width"),

        ...staticFiles(cspNonce, { user: user.get() }),
      )),
      body(...args)
    ))
