import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Drink } from "../entities/Drink"
import { handleAuthHttpResponse, parseId } from "../helpers/endpoint"
import { countLikes, verifyLike } from "../helpers/like"

export const drinkHandler = async (req: Request, res: Response) => {
  const drinksRepository = AppDataSource.getRepository(Drink)
  const drinkId = parseId(req.params.id, res)
  if (!drinkId) return

  const drink = await drinksRepository.findOne({
    where: { id: drinkId },
    relations: ["comments"],
  })

  if (!drink) {
    res.status(400).json({ message: "ID inválido" })
    return
  }

  const user = await handleAuthHttpResponse(req, res)
  const isLiked = user ? await verifyLike(drink, user) : false

  const likes = await countLikes(Drink, drinkId)

  res.status(200).json({ ...drink, likes, isLiked })
}
