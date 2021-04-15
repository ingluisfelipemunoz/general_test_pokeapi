import { HttpModule, HttpService, Module } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { PokemonController } from "./pokemon.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pokemon } from "./pokemon.entity";
import { PokemonRepository } from "./pokemon.repository";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Pokemon, PokemonRepository])],
  providers: [PokemonService],
  controllers: [PokemonController],
})
export class PokemonModule {}
