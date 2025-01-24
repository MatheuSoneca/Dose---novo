import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entities/User"
import { passwordToHash } from "../helpers/hash"

type UserSignupData = {
  username: string
  email: string
  password: string
}

export const signupHandler = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User)
  const body = req.body

  if (
    "email" in body &&
    typeof body.email === "string" &&
    "password" in body &&
    typeof body.password === "string" &&
    "username" in body &&
    typeof body.username === "string"
  ) {
    //CRIAR USUARIO
    const userData = body as UserSignupData
    const user = await userRepository.findOne({
      where: [{ email: userData.email }, { username: userData.username }],
    })

    if (user) {
      const errorMessage =
        user.email === userData.email
          ? "Email já cadastrado."
          : "Username já cadastrado."
      res.status(400).json({ message: errorMessage })
      return
    }

    const newUser = new User()
    newUser.username = userData.username
    newUser.email = userData.email
    newUser.password = await passwordToHash(userData.password)

    await userRepository.save(newUser)

    res.status(201).end()
    return
  }
  //RETORNA ERRO
  res.status(400).json({ message: "Dados Inválidos." })
}
