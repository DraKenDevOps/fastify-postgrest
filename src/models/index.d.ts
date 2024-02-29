import { JWT } from "@fastify/jwt"
import { IJWTPayload } from "./interfaces"

declare module "fastify" {
    export interface FastifyRequest {
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

declare global {
    interface FastifyRequest {
        jwt: JWT
    }
    export interface FastifyInstance {
        authenticate: any
    }
    interface FastifyJWT {
        payload: object
    }
    // namespace Express {
    //     export interface Request {
    //         tokenPayload: IJWTPayload
    //     }
    // }
}
                    
export {}