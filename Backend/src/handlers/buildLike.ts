import { Request, Response } from "express"
import { handleAuthHttpResponse, parseId } from "../helpers/endpoint"
import { AppDataSource } from "../data-source"
import { Like } from "../entities/Like"
import { Comment } from "../entities/Comment"
import { EntityTarget } from "typeorm"
import { Drink } from "../entities/Drink"

export const buildLikeHandler =
  (entity: EntityTarget<Comment | Drink>) =>
  async (req: Request, res: Response) => {
    const user = await handleAuthHttpResponse(req, res)
    if (!user) return

    const likeRepository = AppDataSource.getRepository(Like)
    const entityRepository = AppDataSource.getRepository(entity)

    const entityId = parseId(
      entity === Comment ? req.params.commentId : req.params.drinkId,
      res,
    )
    if (!entityId) return

    const entityEntry = await entityRepository.findOneBy({ id: entityId })

    if (!entityEntry) {
      res.status(400).json({ message: "Dados inválidos" })
      return
    }

    const like = await likeRepository.findOneBy({
      table: entity === Comment ? "comment" : "drink",
      tableId: entityId,
    })

    if (like) {
      likeRepository.delete(like)

      res.status(200).json({ isLiked: false })
      return
    }

    const newLike = new Like()
    newLike.table = entity === Comment ? "comment" : "drink"
    newLike.tableId = entityEntry.id
    newLike.userId = user.id

    await likeRepository.save(newLike)

    res.status(200).json({ isLiked: true })
  }
