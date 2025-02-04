import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Drink } from "../entities/Drink"
import sharp from "sharp"

export const drinksHandler = async (req: Request, res: Response) => {
  const drinksRepository = AppDataSource.getRepository(Drink)
  const body = req.body

  const page = typeof body.page === "number" && body.page > 0 ? body.page : 1

  // Pegar todas as informaações sobre todos os drinks
  const drinks = await drinksRepository.find({
    select: ["id", "name", "image"],
    take: 10,
    skip: (page - 1) * 10,
  })

  const compressedDrinks = await Promise.all(
    drinks.map(async (drink) => {
      const imageBuffer = Buffer.from(drink.image, "base64")
      const resizedBuffer = await sharp(imageBuffer)
        .resize({ height: 200 })
        .toBuffer()
      const resizedImage = resizedBuffer.toString("base64")
      return { ...drink, image: resizedImage }
    }),
  )

  const totalPages = Math.ceil((await drinksRepository.count()) / 10)

  // responder a requisição com a listagem
  res.status(200).json({ drinks: compressedDrinks, page, totalPages })
}
