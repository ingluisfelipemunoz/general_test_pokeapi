import { Base } from "../../base/base.entity";
import { Column, Entity } from "typeorm";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity("pokemon")
export class Pokemon extends Base {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column({
    type: "text",
    nullable: false,
  })
  name: string;
  @ApiPropertyOptional()
  @Column({
    type: "integer",
    nullable: true,
    default: 0,
  })
  height: number;
  @ApiPropertyOptional()
  @Column({
    type: "integer",
    nullable: true,
    default: 0,
  })
  weight: number;
  @ApiPropertyOptional()
  @Column({
    type: "integer",
    nullable: true,
    default: 0,
  })
  numberOfAbilities: number;
}
