import fs from "fs-extra"
import { join } from "path"
import { createStream } from "rotating-file-stream"
import winston from "winston"
import env from "../env"
import { logNameSpace } from "../middlewares/logmiddle"

const logDirectory = join(process.cwd(), "logs")
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const rotatingFileStream = createStream(`${env.SERVICE_NAME}.log`, {
    interval: "1d",
    path: logDirectory,
    maxSize: "50M"
})

const customFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify(
            {
                timestamp,
                level: `${level}`.toUpperCase(),
                message,
                requestId: logNameSpace.get("requestId"),
                tracingData: logNameSpace.get("tracingData"),
                username: logNameSpace.get("username"),
                user_id: logNameSpace.get("user_id"),
                user_type: logNameSpace.get("user_type"),
                user_type_name: logNameSpace.get("user_type_name"),
                ...meta
            },
            null,
            env.NODE_ENV == "production" ? 0 : 4
        )
    })
)

const logger = winston.createLogger({
    level: "verbose",
    format: customFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.colorize({ all: true })
        }),
        new winston.transports.Stream({
            stream: rotatingFileStream
        })
    ],
    defaultMeta: {
        environment: env.NODE_ENV,
        pwd: env.PWD,
        service: env.SERVICE_NAME,
        timezone: env.TZ,
        version: env.VERSION
    }
})

export default logger