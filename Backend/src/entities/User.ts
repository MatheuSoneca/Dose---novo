import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Comment } from "./Comment"

export enum UserRole {
  Admin = "admin",
  Member = "member",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({
    type: "simple-enum", // Indica ao TypeORM que é uma coluna do tipo enum
    enum: UserRole, // Referência para o enum TypeScript
    default: UserRole.Member, // (opcional) define valor padrão
  })
  role: UserRole

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]
}
