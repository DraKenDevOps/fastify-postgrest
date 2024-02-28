import { JwtPayload } from "jsonwebtoken"

export interface IJWTPayload extends JwtPayload {
    username: string | null
    user_id: number | null
}
