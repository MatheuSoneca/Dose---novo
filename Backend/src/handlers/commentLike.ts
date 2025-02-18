import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { getUser, parseId } from "../helpers/endpoint"
import { Comment } from "../entities/Comment"
import { countLikes, verifyLike } from "../helpers/like"

export const commentLikeHandler = async (req: Request, res: Response) => {
  const user = await getUser(req)
  const commentRepository = AppDataSource.getRepository(Comment)

  const commentId = parseId(req.params.commentId, res)
  if (!commentId) return

  const comment = await commentRepository.findOneBy({ id: commentId })
  if (!comment) {
    res.status(400).json({ message: "ID inválido" })
    return
  }

  const isLiked = user ? await verifyLike(comment, user) : false

  const likes = await countLikes(Comment, commentId)

  res.status(200).json({ likes, isLiked })
}
