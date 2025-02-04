import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Comment } from "./Comment"

@Entity()
export class Drink {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  image: string

  @Column()
  description: string

  @Column()
  ingredients: string

  @Column()
  instructions: string

  @OneToMany(() => Comment, (comment) => comment.drink)
  comments: Comment[]
}
