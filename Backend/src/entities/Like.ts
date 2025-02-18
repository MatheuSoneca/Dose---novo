import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  table: string

  @Column()
  tableId: number

  @Column()
  userId: number
}
