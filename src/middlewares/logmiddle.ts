import cls from "cls-hooked"
import { generateUUIDV4 } from "../utils/functions"
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"
import logger from "../utils/logger"

export const logNameSpace = cls.createNamespace("logger")

export function logRequestResponse(req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction, ignorePaths: Array<string>) {
    if (ignorePaths && [...ignorePaths].some(path => req.originalUrl.includes(path))) return next()
    const ip = req.headers["x-real-ip"] || req.socket.remoteAddress || req.connection.remoteAddress
    const requestId = generateUUIDV4()
    const tracingData = ""

    const originalSend = res.send
    const startTime = Date.now()

    // @ts-ignore
    res.send = function (data: any) {
        const time = Date.now() - startTime

        let body
        try {
            body = JSON.parse(data)
        } catch (e) {
            body = data
        }

        let statusCode = res.statusCode.toString()
        let level = "info"
        if (statusCode.startsWith("4")) {
            level = "warn"
        } else if (statusCode.startsWith("5")) {
            level = "error"
        }

        logger.log(level, "RequestResponse", {
            requestId,
            request: {
                method: req.method,
                url: req.originalUrl,
                ip,
                requestBody: logNameSpace.get("requestBody")
            },
            response: {
                statusCode: Number(statusCode),
                time,
                body
            },
            tracingData
        })
        originalSend.apply(res, [arguments[0]])
    }

    logNameSpace.run(() => {
        logNameSpace.set("requestId", requestId)
        logNameSpace.set("tracingData", tracingData)
        logNameSpace.set("ip", ip)
        return next()
    })
}
