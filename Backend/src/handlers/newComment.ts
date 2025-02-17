import { Request, Response } from "express"
import { validateObject } from "../helpers/typeGuard"
import { AppDataSource } from "../data-source"
import { handleAuthHttpResponse, parseId } from "../helpers/endpoint"
import { Drink } from "../entities/Drink"
import { Comment } from "../entities/Comment"

type CommentData = {
  text: string
}

export const newCommentHandler = async (req: Request, res: Response) => {
  const user = await handleAuthHttpResponse(req, res)
  if (!user) return

  const commentRepository = AppDataSource.getRepository(Comment)
  const drinksRepository = AppDataSource.getRepository(Drink)
  const body = req.body

  const drinkId = parseId(req.params.id, res)
  if (!drinkId) return

  const drink = await drinksRepository.findOneBy({ id: drinkId })
  if (!drink) {
    res.status(400).json({ message: "Drink não encontrado" })
    return
  }

  if (
    !validateObject<CommentData>(body, {
      text: "string",
    })
  ) {
    res.status(400).json({ message: "Dados inválidos" })
    return
  }

  const newComment = new Comment()
  newComment.text = body.text
  newComment.user = user
  newComment.drink = drink

  await commentRepository.save(newComment)

  res.status(200).json({ comment: newComment.text })
}
