import { z } from "zod";

export const UserRegister = z.object({
    name: z.string().min(4, {message: "Minimo 4 caracters"}).max(50),
    email: z.string().email(),
    password: z.string().min(5, {message: "Minimo 6 caracters"}).max(20),
  });

export const UserLogin = z.object({
    email: z.string().email(),
    password: z.string().min(5, {message: "Minimo 6 dígitos"}).max(20),
})

