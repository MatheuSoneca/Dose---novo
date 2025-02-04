import { Request, Response } from "express"
import { extractAuthToken, verifyToken } from "./auth"
import { validateObject } from "./typeGuard"
import { AppDataSource } from "../data-source"
import { User } from "../entities/User"

export const handleAuthHttpResponse = async (
  req: Request,
  res: Response,
): Promise<User | undefined> => {
  const token = extractAuthToken(req.headers.authorization)

  // verificação de token
  if (!token) {
    res.status(401).json({ message: "Header de autenticação inválido" })
    return
  }

  try {
    const userData = verifyToken(token)

    if (
      typeof userData === "string" ||
      !validateObject(userData, { username: "string", email: "string" })
    ) {
      res.status(401).json({ message: "Token inválido" })
      return
    }

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ email: userData.email })

    if (!user) {
      res.status(401).json({ message: "Usuário não existe" })
      return
    }

    return user
  } catch (error) {
    res.status(401).json({ message: "Header de autenticação inválido" })
    return
  }
}

export const parseId = (id: string, res: Response): number | undefined => {
  const numberId = Number(id)
  if (isNaN(numberId)) {
    res.status(400).json({ message: "ID inválido" })
    return
  }
  return numberId
}
