import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify"
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken"
import env from "../env"
import { IJWTPayload } from "../models/interfaces"

const issuer = "Laogw Ltd"
const subject = "keooudone.n@laogw.la"
const audience = "https://laogw.la"

const signOptions: SignOptions = {
    issuer,
    subject,
    audience,
    expiresIn: "24h",
    algorithm: "RS256"
}
const verifyOptions: VerifyOptions = {
    issuer,
    subject,
    audience,
    maxAge: "24h",
    algorithms: ["RS256"]
}

export const signToken = (payload: object) => {
    let token = ""
    try {
        token = jwt.sign(payload, env.JWT_PRIVATE_KEY, signOptions)
    } catch (e) {
        console.error(new Date(), "-- ERROR", "Sign token error", e)
        // logger.error("Sign token error", { signError: e })
    }
    return token
}

export const verifyToken = (req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) => {
    let token = req.headers["x-access-token"] as string
    token = req.headers.authorization ? `${req.headers.authorization}`.replace("Bearer ", "") : token

    if (!token) return res.status(403).send({ status: "error", message: "No token provided." })

    try {
        const decoded = jwt.verify(token, env.JWT_PUBLIC_KEY, verifyOptions) as IJWTPayload
        req.tokenPayload = decoded
        // if (decoded["username"]) logNameSpace.set("username", decoded["username"])
        // if (decoded["user_id"]) logNameSpace.set("userId", decoded["user_id"])
        next()
    } catch (e) {
        console.error(new Date(), "-- ERROR", req.method, req.originalUrl, "Verify Token Error", e)
        // logger.error("Verify Token Error", { verifyError: e })
        return res.status(500).send({ status: "error", message: "Failed to authenticate token." })
    }
}