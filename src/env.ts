import { config } from "dotenv"
import { name, version } from "../package.json"

config()

const env = {
    PWD: process.cwd(),
    SERVICE_NAME: process.env.SERVICE_NAME || name || "fastify-postgre",
    VERSION: process.env.VERSION || version,
    NODE_ENV: process.env.NODE_ENV as "development" | "uat" | "beta" | "production",
    HOST: process.env.HOST || "0.0.0.0",
    PORT: Number(process.env.PORT) || 8080,
    BASE_PATH: process.env.BASE_PATH || "api",
    TZ: process.env.TZ || "Asia/Bangkok",
    DB_HOST: process.env.DB_HOST as string,
    DB_USER: process.env.DB_USER as string,
    DB_PASS: process.env.DB_PASS as string,
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    DB_SCHEMA: process.env.DB_SCHEMA || "test",
    DB_CONNECTION: process.env.DB_CONNECTION as string,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY as string,
    JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY as string
}

export default env
