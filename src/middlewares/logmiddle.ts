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

    // let requestBody = req.body
    // if (req.body) {
    //     try {
    //         requestBody = JSON.stringify(req.body as { Body: any })
    //     } catch (error) {
    //         requestBody = req.body as { Body: any }
    //     }
    // }
    
    logger.info("Request", {
        method: req.method,
        url: req.originalUrl,
        requestId,
        ip,
        requestBody: req.body,
        tracingData
    })

    const originalSend = res.send
    const startTime = Date.now()

    // @ts-ignore
    res.send = function (data: any) {
        const responseTime = Date.now() - startTime

        // Attempt to parse the response body as JSON; if it fails, use the original data
        let responseBody
        try {
            responseBody = JSON.parse(data)
        } catch (e: any) {
            responseBody = data
        }

        let statusCode = res.statusCode.toString()
        let level = "info"
        if (statusCode.startsWith("4")) {
            level = "warn"
        } else if (statusCode.startsWith("5")) {
            level = "error"
        }

        logger.log(level, "Response", {
            requestId,
            statusCode: Number(statusCode),
            responseTime,
            responseBody,
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
