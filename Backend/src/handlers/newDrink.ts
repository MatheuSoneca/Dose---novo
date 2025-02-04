import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Drink } from "../entities/Drink"
import { validateObject } from "../helpers/typeGuard"
import { extractAuthToken, verifyToken } from "../helpers/auth"
import { User, UserRole } from "../entities/User"
import { handleAuthHttpResponse } from "../helpers/endpoint"

type NewDrinkData = {
  name: string
  image: string
  description: string
  ingredients: string
  instructions: string
}

export const newDrinkHandler = async (req: Request, res: Response) => {
  const user = await handleAuthHttpResponse(req, res)
  if (!user) return

  if (user.role !== UserRole.Admin) {
    res.status(403).json({ message: "Usuário não é admin" })
    return
  }

  const drinksRepository = AppDataSource.getRepository(Drink)
  const body = req.body

  if (
    validateObject<NewDrinkData>(body, {
      name: "string",
      image: "string",
      description: "string",
      ingredients: "string",
      instructions: "string",
    })
  ) {
    const drink = await drinksRepository.findOneBy({ name: body.name })

    if (drink) {
      res.status(400).json({ message: "Esse drink já existe" })
      return
    }

    const newDrink = new Drink()
    newDrink.name = body.name
    newDrink.image = body.image
    newDrink.description = body.description
    newDrink.ingredients = body.ingredients
    newDrink.instructions = body.instructions

    await drinksRepository.save(newDrink)

    res.status(200).json({ drink: newDrink })
    return
  }

  res.status(400).json({ message: "Dados inválidos." })
}
