import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
import { Pokemon } from "./pokemon.entity";
import { PokemonService } from "./pokemon.service";

@Controller("pokemon")
export class PokemonController {
  constructor(private service: PokemonService) {}
  @Get("")
  async getList(
    @Query("limit") limit: number,
    @Query("offset") offset: number,
    @Query("isLocal") isLocal: boolean
  ) {
    return await this.service.getList(isLocal, limit, offset);
  }

  @Get("/:id_name")
  async getOne(
    @Param("id_name") id_name: number | string,
    @Query("isLocal") isLocal: boolean | string
  ) {
    return await this.service.getOne(id_name, isLocal);
  }

  @Post("")
  async saveOne(@Body() dto: Pokemon) {
    return await this.service.saveOne(dto);
  }

  @Patch("/:id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() dto: Pokemon) {
    return await this.service.update(id, dto);
  }
}
