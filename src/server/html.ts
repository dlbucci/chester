import { MixArgs } from "rokay/mix"
import { async, charset, lang, src } from "rokay/server/attr"
import { apd, Elt } from "rokay/server/core"
import { _meta, body, head, html, link, meta, script, title } from "rokay/server/elt"

import { AppServer } from "./app.js"


export const
  HTML = (_app: AppServer, ...args: MixArgs<Elt>) =>
    html(lang("en"), apd(
      head(apd(
        title(apd("Chester")),

        _meta(charset("utf-8")),
        meta("apple-mobile-web-app-capable", "yes"),
        meta("format-detection", "telephone=no"),
        meta("theme-color", "#dde"),
        meta("viewport", "initial-scale=1,user-scalable=no,width=device-width"),

        link("manifest", "/manifest.json"),
        link("stylesheet", "/chester.css"),

        script(async, src("/chester.js")),
      )),
      body(...args),
    ))
