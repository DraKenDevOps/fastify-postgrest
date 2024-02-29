import { JwtPayload } from "jsonwebtoken"

export interface IJWTPayload extends JwtPayload {
    [key: string]: any
}
