import { z } from "zod";

// auth
export const signupSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    phone: z.string(),
    receiveUpdates: z.boolean()
})

export const signinSchema = z.object({
    email: z.string(),
    password: z.string(),
    rememberMe: z.boolean()
})

//Events