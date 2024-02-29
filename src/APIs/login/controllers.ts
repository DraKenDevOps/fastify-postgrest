import { FastifyReply, FastifyRequest } from "fastify"
import { logNameSpace } from "../../middlewares/logmiddle"

export async function loginController(req:FastifyRequest<{Body: { username: string, password: string}}>, res: FastifyReply){
    if(!req.body) return { status: "error", message:"body is required!!." }
    logNameSpace.set("requestBody", req.body)

    const token = req.jwt.sign({
        username: req.body.username,
        password: req.body.password
    })

    return res.send({
        token
    })
}