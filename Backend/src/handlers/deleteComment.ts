import express, { Request, Response } from "express"
import { extractAuthToken, verifyToken } from "../helpers/auth"
import { validateObject } from "../helpers/typeGuard"
import { AppDataSource } from "../data-source"
import { User, UserRole } from "../entities/User"
import { handleAuthHttpResponse, parseId } from "../helpers/endpoint"
import { Drink } from "../entities/Drink"
import { Comment } from "../entities/Comment"

export const deleteCommentHandler = async (req: Request, res: Response) => {
  const user = await handleAuthHttpResponse(req, res)
  if (!user) return

  const commentId = parseId(req.params.commentId, res)
  if (!commentId) return

  const commentRepository = AppDataSource.getRepository(Comment)
  const comment = await commentRepository.findOne({
    where: { id: commentId },
    relations: ["user"],
  })

  if (!comment) {
    res.status(400).json({ message: "Dados inválidos" })
    return
  }

  if (user.role !== UserRole.Admin && user.id !== comment.user.id) {
    res.status(403).json({
      message: "Usuário não possui permissão para deletar esse comentario.",
    })
    return
  }

  commentRepository.delete(comment)
  res.status(201).end()
}
