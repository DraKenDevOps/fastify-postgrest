import { FastifyInstance } from "fastify"
import { loginController } from "./APIs/login/controllers"
import { verifyToken } from "./utils/jwt"

async function router(router: FastifyInstance) {
    router.get("/dummy", () => {
        return "this is test dummy"
    })
    router.get("/verify-jwt", {
        preHandler: verifyToken,
    }, (req) => {
        console.log(req.tokenPayload)
        return "Verify token success"
    })
    router.post("/login", loginController)
}

export default router
