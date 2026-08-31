import { DB } from "rokay/server/db/db"


export type ChesterDB = ReturnType<typeof ChesterDB>


export const
  ChesterDB = (db: DB) => ({
    single: db.single,

    transact: db.transact,
  })
