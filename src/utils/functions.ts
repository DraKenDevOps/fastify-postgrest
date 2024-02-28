import crypto from "crypto"
import env from "../env"
import dayjs from "dayjs"

export function delay(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(null), ms)
    })
}

export function footerDate(){
    let format = ""
    if(env.NODE_ENV == "uat") {
        format = dayjs().add(7, "hours").format("DD/MM/YYYY HH:mm:ss")
    } else {
        format = dayjs().format("DD/MM/YYYY HH:mm:ss")
    }
    return format
}

export const generateUUIDV4 = () => crypto.randomUUID()
