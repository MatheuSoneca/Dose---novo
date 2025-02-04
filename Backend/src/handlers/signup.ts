import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entities/User"
import { passwordToHash } from "../helpers/hash"
import { validateObject } from "../helpers/typeGuard"

type UserSignupData = {
  username: string
  email: string
  password: string
}

export const signupHandler = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User)
  const body = req.body

  if (
    validateObject<UserSignupData>(body, {
      email: "string",
      password: "string",
      username: "string",
    })
  ) {
    //CRIAR USUARIO
    // const userData = body as UserSignupData
    const user = await userRepository.findOne({
      where: [{ email: body.email }, { username: body.username }],
    })

    if (user) {
      const errorMessage =
        user.email === body.email
          ? "Email já cadastrado."
          : "Username já cadastrado."
      res.status(400).json({ message: errorMessage })
      return
    }

    const newUser = new User()
    newUser.username = body.username
    newUser.email = body.email
    newUser.password = await passwordToHash(body.password)

    await userRepository.save(newUser)

    res.status(201).end()
    return
  }

  //RETORNA ERRO
  res.status(400).json({ message: "Dados Inválidos." })
}
