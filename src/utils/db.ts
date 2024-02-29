import * as pg from "pg"
import env from "../env"

const db = new pg.Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_SCHEMA
})

export default db
