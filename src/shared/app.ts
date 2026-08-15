import { User } from "okay-site-login/shared/users/types.gen"
import { Asink } from "rokay/prop/async"
import { Router } from "rokay/route/router"


export type App = {
  router: Router
  user: Asink<User>
}
