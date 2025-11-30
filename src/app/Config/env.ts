import dotenv from "dotenv";

dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    JWT_SECRET: string,
    Jwt_ACCESS_EXPIRES: string,
    Jwt_REFRESH_SECRET: string,
    Jwt_REFRESH_EXPRIES: string,
    BCRYPT_SALT: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASS: string,
    GOOGLE_CLIENT_ID : string, 
    GOOGLE_CLIENT_SECRET : string,
    GOOGLE_CALLBACK_URL : string,
    EXPRESS_SESSION_SECRET : string , 
    FRONTEND_URL : string


}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV", "JWT_SECRET", "Jwt_ACCESS_EXPIRES", "BCRYPT_SALT", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASS"];

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_SECRET: process.env.JWT_SECRET as string,
        Jwt_ACCESS_EXPIRES: process.env.Jwt_ACCESS_EXPIRES as string,
        Jwt_REFRESH_SECRET: process.env.Jwt_REFRESH_SECRET as string,
        Jwt_REFRESH_EXPRIES: process.env.Jwt_REFRESH_EXPRIES as string,
        BCRYPT_SALT: process.env.BCRYPT_SALT as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
    }
}

export const envVars = loadEnvVariables()