/* tslint:disable:quotemark object-literal-key-quotes */
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const database_config: TypeOrmModuleOptions = {
  'type': "mysql",
  "host": process.env.DATABASE_HOST || 'localhost',
  "port": 3306,
  "username": "user",
  'password': "user",
  'database': "ps7",
  "entities": ["src/**/**.entity{.ts,.js}"],
  "synchronize": true,
};

export const database_test_config: TypeOrmModuleOptions = {
  "type": "mysql",
  "host": process.env.DATABASE_TEST_HOST  || 'localhost',
  "port": 3307,
  "username": "user",
  "password": "user",
  "database": "ps7-test",
  "entities": ["src/**/**.entity{.ts,.js}"],
  "synchronize": true,
};