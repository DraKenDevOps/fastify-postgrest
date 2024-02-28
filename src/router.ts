import { FastifyInstance } from "fastify"

// TODO: import controller

function router(router:FastifyInstance){
    router.get("/dummy", () => {
        return "this is test dummy".toUpperCase()
    })
}

export default router