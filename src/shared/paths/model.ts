import { eq, minus, V, VZ } from "rokay/math/v"


export const
  getPath = (from: V, to: V): V[] | undefined => {
    let d = minus(to, from)
    let vert = (Math.abs(d.x) <= Math.abs(d.y))
    const path: V[] = []
    while (!eq(d, VZ)) {
      if (vert) {
        path.push(from = V(from.x, from.y + Math.sign(d.y)))
      } else {
        path.push(from = V(from.x + Math.sign(d.x), from.y))
      }

      d = minus(to, from)
      if ((vert && d.y === 0) || (!vert && d.x === 0)) { vert = !vert }
    }
    return path
  }
