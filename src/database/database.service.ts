import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionOptions } from "typeorm";
import { Configuration } from "../config/config.keys";
import { ConfigModule, ConfigService } from "@nestjs/config";
export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
      let host = config.get(Configuration.HOST);
      let username = config.get(Configuration.USERNAME);
      let database = config.get(Configuration.DATABASE);
      let password = config.get(Configuration.PASSWORD);
      return {
        ssl: false,
        type: "postgres" as "postgres",
        host: config.get(Configuration.HOST),
        username: config.get(Configuration.USERNAME),
        password: config.get(Configuration.PASSWORD),
        database: config.get(Configuration.DATABASE),
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        migrations: [__dirname + "/migrations/*{.ts,.js}"],
      } as ConnectionOptions;
    },
  }),
];
