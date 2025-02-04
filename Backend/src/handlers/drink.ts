import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Drink } from "../entities/Drink"
import { parseId } from "../helpers/endpoint"

export const drinkHandler = async (req: Request, res: Response) => {
  const drinksRepository = AppDataSource.getRepository(Drink)
  const drinkId = parseId(req.params.id, res)
  if (!drinkId) return

  const drink = await drinksRepository.findOne({
    where: { id: drinkId },
    relations: ["comments"],
  })

  if (drink) {
    res.status(200).json({ drink })
    return
  }

  res.status(400).json({ message: "ID inválido" })
  return
}
