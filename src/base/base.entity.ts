import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

export abstract class Base {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn({
    type: "timestamp with time zone",
    name: "created_at",
  })
  createdAt: string;
  @UpdateDateColumn({
    type: "timestamp with time zone",
    name: "updated_at",
  })
  updatedAt: string;
}
