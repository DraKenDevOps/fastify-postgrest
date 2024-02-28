import Fastify, { FastifyReply, FastifyRequest } from "fastify"
import jwt, {JWT} from "@fastify/jwt"
import env from "./env"
import router from "./router"

declare module "fastify" {
    interface FastifyRequest {
        jwt: JWT
        // tokenPayload: any
    }
    export interface FastifyInstance {
        authenticate: any
    }
}

declare module "@fastify/jwt" {
    export interface FastifyJWT {
        payload: {
            user_id: number
            username: string
        }
    }
}

const server = Fastify()

server.register(jwt, {
    secret: {
        private: env.JWT_PRIVATE_KEY,
        public: env.JWT_PUBLIC_KEY,
    },
    sign: {
        algorithm: "RS256"
    }
})

server.decorate("authenticate", async (req:FastifyRequest, res: FastifyReply) => {
    try {
        await req.jwtVerify()
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: "error",
            message: "Failed to authenticate token."
        })
    }
})

server.get("/", (req, res) => {
    return res.send({
        status: "OK",
        uptime: process.uptime(),
        timestamp: Date.now(),
        instance: env.SERVICE_NAME
    })
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

// TODO: import other api router
server.register(router, {
    prefix: `/${env.BASE_PATH}/v1`
})

export default server
