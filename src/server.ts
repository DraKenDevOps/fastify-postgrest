import Fastify, { FastifyReply, FastifyRequest } from "fastify"
import jwt, {JWT} from "@fastify/jwt"
import env from "./env"
import router from "./router"
import prom from "prom-client"
import { IJWTPayload } from "./models/interfaces"
import logger from "./utils/logger"
import { logRequestResponse } from "./middlewares/logmiddle"

declare module "fastify" {
    interface FastifyRequest {
        jwt: JWT
        tokenPayload: IJWTPayload
    }
    export interface FastifyInstance {
        authenticate: any
    }
}

declare module "@fastify/jwt" {
    export interface FastifyJWT {
        payload: object
    }
}

const server = Fastify()
const registry = new prom.Registry()
registry.setDefaultLabels({
    worker: env.SERVICE_NAME
})
prom.collectDefaultMetrics({
    labels: { NODE_APP_INSTANCE: env.SERVICE_NAME },
    register: registry
})

server.register(jwt, {
    secret: {
        private: env.JWT_PRIVATE_KEY,
        public: env.JWT_PUBLIC_KEY,
    },
    sign: {
        algorithm: "RS256",
        iss: "Laogw Ltd",
        sub:"keooudone.n@laogw.la",
        aud: "https://laogw.la",
        expiresIn: "24h"
    },
    verify: {
        algorithms: ["RS256"],
        maxAge: "24h",
        allowedIss: "Laogw Ltd",
        allowedSub: "keooudone.n@laogw.la",
        allowedAud: "https://laogw.la"
    }
})

server.decorate("authenticate", async (req:FastifyRequest, res: FastifyReply) => {
    try {
        await req.jwtVerify()
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            status: "error",
            message: "Failed to authenticate token."
        })
    }
})

server.addHook("onRequest", (req, res, next) => logRequestResponse(req, res, next, ["metrics"]))
// server.addHook("onRequest", (req, res, next) => logRequest(req, res, next, ["metrics"]))
// server.addHook("onResponse", (req, res, next) => logResponse(req, res, next, ["metrics"]))

server.get("/", (req, res) => {
    return res.send({
        status: "OK",
        uptime: process.uptime(),
        timestamp: Date.now(),
        instance: env.SERVICE_NAME
    })
})

server.get("/metrics", async (req, res) => {
    res.header("Content-Type", registry.contentType)
    let metrics = ""
    try {
        metrics = await registry.metrics()
    } catch (error) {
        if(env.NODE_ENV == "development") {
            console.info(new Date() + " -- ERROR metrics error", error)
        } else {
            logger.error("Metrics error", { error })
        }
    }
    return res.send(metrics)
})

// server.get("/", () => {
//     return {
//         status: "OK",
//         uptime: process.uptime(),
//         timestamp: Date.now(),
//         instance: env.SERVICE_NAME
//     }
// })

server.addHook("preHandler", (req, res, next) => {
    req.jwt = server.jwt
    return next()
})

server.register(router, {
    prefix: `/${env.BASE_PATH}/v1`
})

export default server
