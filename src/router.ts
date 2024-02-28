import { FastifyInstance } from "fastify"
import { loginController } from "./APIs/login/controllers"
// TODO: import controller

async function router(router: FastifyInstance) {
    router.get("/dummy", () => {
        return "this is test dummy".toUpperCase()
    })
    router.post("/login", loginController)
}

export default router
