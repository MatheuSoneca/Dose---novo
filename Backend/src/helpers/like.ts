import { EntityTarget } from "typeorm"
import { AppDataSource } from "../data-source"
import { Like } from "../entities/Like"
import { Drink } from "../entities/Drink"
import { Comment } from "../entities/Comment"
import { User } from "../entities/User"

export const countLikes = (
  entity: EntityTarget<Comment | Drink>,
  id: number,
) => {
  const likeRepository = AppDataSource.getRepository(Like)

  const entriesCount = likeRepository.countBy({
    table: entity === Comment ? "comment" : "drink",
    tableId: id,
  })

  return entriesCount
}

export const verifyLike = async (
  entity: Comment | Drink,
  user: User,
): Promise<boolean> => {
  const likeRepository = AppDataSource.getRepository(Like)

  const like = await likeRepository.findOneBy({
    table: entity instanceof Comment ? "comment" : "drink",
    tableId: entity.id,
    userId: user.id,
  })

  const isLiked = Boolean(like)
  return isLiked
}
