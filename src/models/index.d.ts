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
        payload: {
            user_id: number
            username: string
        }
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
        payload: {
            user_id: number
            username: string
        }
    }
    // namespace Express {
    //     export interface Request {
    //         tokenPayload: IJWTPayload
    //     }
    // }
}
                    
export {}