import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entities/User"
import { checkPassword } from "../helpers/hash"
import jwt from "jsonwebtoken"
import { validateObject } from "../helpers/typeGuard"

type UserLoginData = {
  email: string
  password: string
}

const WRONG_CREDENTIALS_ERROR = "Email ou senha incorretos!"

export const loginHandler = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User)
  const body = req.body

  if (
    validateObject<UserLoginData>(body, { email: "string", password: "string" })
  ) {
    // login
    const user = await userRepository.findOneBy({ email: body.email })

    if (!user) {
      res.status(400).json({ message: WRONG_CREDENTIALS_ERROR })
      return
    }

    const isCorrectPassword = await checkPassword(user.password, body.password)

    if (!isCorrectPassword) {
      res.status(400).json({ message: WRONG_CREDENTIALS_ERROR })
      return
    }

    //Gerar token
    try {
      const token = jwt.sign(
        { username: user.username, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "3d" },
      )

      res.status(200).json({ token })
      return
    } catch (erro) {
      res.status(500).json({ error: "Erro interno do servidor" })
      return
    }
  }

  res.status(400).json({ message: "Dados inválidos!" })
  return
}
