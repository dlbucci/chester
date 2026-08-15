import { DB } from "rokay/server/db/db"


export type UnicornDB = ReturnType<typeof UnicornDB>


export const
  UnicornDB = (db: DB) => ({
    single: db.single,

    transact: db.transact,
  })
