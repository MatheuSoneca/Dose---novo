import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite", // nome do arquivo sqlite
  synchronize: true,          // NÃO USE 'true' em produção (gera tabelas automaticamente)
  logging: false,
  entities: ["src/entities/*.ts"],  // ou ["dist/entities/*.js"] se estiver compilando antes
  migrations: ["src/migrations/*.ts"], 
  subscribers: [],
});
