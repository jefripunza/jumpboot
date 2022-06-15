import { TypeORM } from "jumpboot";
const { Entity, PrimaryGeneratedColumn, Column } = TypeORM;

@Entity({ name: "target_snake_case" })
export default class TargetCamelCaseEntity {
  // Meta : Selector
  @PrimaryGeneratedColumn()
  id?: number;

  // Meta :------------> Timeline
  @Column({
    default: () => {
      return "now()";
    },
  })
  created_date?: Date;

  @Column({
    nullable: true,
  })
  modified_date?: Date;

  @Column({
    length: 50,
    default: "SYSTEM",
  })
  modified_by?: string;

  // Meta :------------> Soft Delete
  @Column({
    default: false,
  })
  is_deleted?: boolean;

  @Column({
    nullable: true,
  })
  deleted_date?: Date;

  @Column({
    length: 150,
    nullable: true,
  })
  delete_reason?: string;

  // ---------------------------------------- //
  // ------------- Main Content ------------- //

  @Column({ length: 30 })
  name?: string;

  @Column({ length: 13, unique: true })
  phone?: string;

  @Column({ length: 100 })
  password?: string;

  @Column({ type: "text" })
  biography?: string;
}
