import {
  HttpService,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Pokemon } from "./pokemon.entity";
import { PokemonRepository } from "./pokemon.repository";

@Injectable()
export class PokemonService {
  constructor(private _http: HttpService, private repo: PokemonRepository) {}

  /**
   * Save a record in database
   * @param dto Dto with the information to be saved
   * @returns saved entity
   */
  async saveOne(dto: Pokemon) {
    let pokemon = plainToClass(Pokemon, dto);
    return await this.repo.save(pokemon);
  }

  /**
   * Update a record in database
   * @param id Entity id
   * @param dto DTO with the information to be updated
   * @returns updated entity
   */
  async update(id: number, dto: Pokemon) {
    let prev_entity = await this.getOneLocal(id);
    let entity = this.bindEntity(prev_entity, dto);
    return await this.repo.save(entity);
  }

  /**
   * Bind the properties of the entity for its correct update
   * @param prev_entity previus entity
   * @param dto DTO with the information
   * @returns
   */
  bindEntity(prev_entity: Pokemon, dto: Pokemon) {
    let pokemon = new Pokemon();
    pokemon.name = dto?.name ? dto.name : prev_entity.name;
    pokemon.height = dto?.height > 0 ? dto.height : prev_entity.height;
    pokemon.weight = dto?.weight > 0 ? dto.weight : prev_entity.weight;
    pokemon.numberOfAbilities =
      dto?.numberOfAbilities > 0
        ? dto.numberOfAbilities
        : prev_entity.numberOfAbilities;
    pokemon.id = prev_entity.id;
    return pokemon;
  }

  /**
   * Get a list with pokemon records
   * @param isLocal determine what is the source to search the information
   * @param limit limit
   * @param offset offset
   * @param search search
   * @returns return a list of pokemons
   */

  async getList(
    isLocal: boolean | string,
    limit: number = 100,
    offset: number = 0,
    search: string = ""
  ) {
    if (isLocal == true || isLocal == "true") {
      return await this.getListLocal(limit, offset, search);
    } else {
      return await this.getListRemote(limit, offset, search);
    }
  }

  /**
   * Get a list of pokemons from pokeapi
   * @param limit  limit
   * @param offset offset
   * @param search search
   * @returns return a list of pokemons from pokeapi
   */
  private async getListRemote(
    limit: number = 100,
    offset: number = 0,
    search: string = ""
  ) {
    let filters = this.getFilters({ limit, offset });
    let url: string = process.env.POKEMON_API + `/pokemon?${filters}`;
    let res: any = {};
    try {
      res = await this._http.get(url).toPromise();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
    return res?.data;
  }

  /**
   * Get a list of pokemons from aws rds database
   * @param limit  limit
   * @param offset offset
   * @param search search
   * @returns return a list of pokemons from aws rds database
   */
  private async getListLocal(
    limit: number = 100,
    offset: number = 0,
    search: string = ""
  ) {
    let filters = this.getFilters({ limit, offset });
    let url: string = process.env.POKEMON_API + `/pokemon?${filters}`;
    let res: any = {};
    try {
      res = await this.repo.find({
        skip: offset || null,
        take: limit || null,
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
    return res;
  }

  /**
   * Get one record
   * @param id id or name
   * @param isLocal determine the source to search the record
   * @returns return a record from aws rds or pokeapi
   */
  async getOne(id: number | string, isLocal: boolean | string) {
    if (isLocal == true || isLocal == "true") {
      return await this.getOneLocal(id);
    } else {
      return await this.getOneRemote(id);
    }
  }

  /**
   * Get one record from pokeapi
   * @param id id or name
   * @returns return a record from pokeapi
   */
  async getOneRemote(id: number | string) {
    let url: string = process.env.POKEMON_API + `/pokemon/${id}`;
    let res: any = {};
    try {
      res = await this._http.get(url).toPromise();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
    return res?.data;
  }

  /**
   * Get one record from aws rds database
   * @param id id or name
   * @returns return a record from aws rds database
   */
  async getOneLocal(id: number | string) {
    let res: any = {};
    try {
      res = await this.repo.findOne({
        where: [{ id: Number(id) || null }, { name: id }],
      });
      if (!res) {
        throw new NotFoundException("not found");
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
    return res;
  }

  /**
   * get the query parameter for pokeapi
   * @param obj Object of filters
   * @returns return an string with the query parameter for pokeapi
   */
  getFilters(obj: any) {
    if (!obj?.limit || obj?.offset) return "";
    //let search = (obj?.search && String(obj?.search).length > 0) ? `search=${}`
    return `limit=${Number(obj.limit)}&offset=${Number(obj.offset)}`;
  }
}
