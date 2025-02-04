import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"
import { Drink } from "./Drink"

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  text: string

  @ManyToOne(() => User, (user) => user.comments)
  user: User

  @ManyToOne(() => Drink, (drink) => drink.comments)
  drink: Drink
}
