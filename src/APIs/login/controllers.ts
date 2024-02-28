import { FastifyReply, FastifyRequest } from "fastify"

export async function loginController(req:FastifyRequest<{Body: { username: string, password: string}}>, res: FastifyReply){
    const token = req.jwt.sign({
        username: req.body.username,
        password: req.body.password
    })

    return res.send({
        token
    })
}