import server from "./server";
import env from "./env";
import logger from "./utils/logger";

server.listen({
    port: env.PORT,
    host: env.HOST
}).then(listen => {
    if (env.NODE_ENV == "development") {
        console.info(
            new Date() + " -- INFO Started bot server",
            JSON.stringify({
                listen,
                base_path: env.BASE_PATH,
                service: env.SERVICE_NAME,
                environment: env.NODE_ENV,
                timezone: env.TZ,
                pwd: env.PWD,
                version: env.VERSION
            })
        )
    } else {
        logger.info("Started bot server", {
            listen,
            base_path: env.BASE_PATH
        })
    }
}).catch(error => {
    if (env.NODE_ENV == "development") {
        console.error(new Date() + " -- ERROR Server error", JSON.stringify(error))
    } else {
        logger.error("Server error", { error })
    }
    process.exit(1)
})

const signals: Array<NodeJS.Signals> = [
    "SIGABRT",
    "SIGALRM",
    "SIGBUS",
    "SIGCHLD",
    "SIGCONT",
    "SIGFPE",
    "SIGHUP",
    "SIGILL",
    "SIGINT",
    "SIGIO",
    "SIGIOT",
    "SIGKILL",
    "SIGPIPE",
    "SIGPOLL",
    "SIGPROF",
    "SIGPWR",
    "SIGQUIT",
    "SIGSEGV",
    "SIGSTKFLT",
    "SIGSTOP",
    "SIGSYS",
    "SIGTERM",
    "SIGTRAP",
    "SIGTSTP",
    "SIGTTIN",
    "SIGTTOU",
    "SIGUNUSED",
    "SIGURG",
    "SIGUSR1",
    "SIGUSR2",
    "SIGVTALRM",
    "SIGWINCH",
    "SIGXCPU",
    "SIGXFSZ",
    "SIGBREAK",
    "SIGLOST",
    "SIGINFO"
]

for (const signal of signals) {
    process.on(signal, async () => {
        if (env.NODE_ENV == "development") {
            console.warn(`${new Date()} -- WARN ${signal} signal received.`)
            console.warn(`${new Date()} -- WARN HTTP: closing ${env.SERVICE_NAME} server...`)
        } else {
            logger.warn(`${signal} signal received.`)
            logger.warn(`HTTP closing ${env.SERVICE_NAME} server...`)
        }
        await server.close()
        if (env.NODE_ENV == "development") {
            console.warn(`${new Date()} -- WARN HTTP: ${env.SERVICE_NAME} server is closed.`)
        } else {
            logger.warn(`HTTP ${env.SERVICE_NAME} server is closed.`)
        }
        process.exit(0)
    })
}