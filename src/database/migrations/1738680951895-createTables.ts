import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1738680951895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`

                create table if not exists companies
                (
                    id          uuid                     default uuid_generate_v4() not null
                        constraint "PK_d4bc3e82a314fa9e29f652c2c22"
                            primary key,
                    name        varchar                                             not null
                        constraint "UQ_3dacbb3eb4f095e29372ff8e131"
                            unique,
                    active      boolean                  default true               not null,
                    "createdAt" timestamp with time zone default now()              not null,
                    "updatedAt" timestamp with time zone default now()              not null,
                    "deletedAt" timestamp with time zone
                );

                alter table companies owner to postgres;
                
                create table if not exists users
                (
                    id                  uuid                     default uuid_generate_v4() not null
                        constraint "PK_a3ffb1c0c8416b9fc6f907b7433"
                            primary key,
                    name                varchar                                             not null,
                    email               varchar                                             not null,
                    "salaryType"        varchar                                             not null,
                    "salaryOrDailyRate" numeric                                             not null,
                    "companyId"         uuid                                                not null
                        constraint "FK_6f9395c9037632a31107c8a9e58"
                            references companies,
                    "createdAt"         timestamp with time zone default now()              not null,
                    "updatedAt"         timestamp with time zone default now()              not null,
                    "deletedAt"         timestamp with time zone,
                    constraint "UQ_2d4a15c7f8b3864a5465fb687ee"
                        unique (name, email)
                );
    
                alter table users owner to postgres;

                DROP INDEX IF EXISTS IDX_cee9af4af35c9c126a449b86c4;
    
                create index "IDX_cee9af4af35c9c126a449b86c4"
                    on users ("salaryType");

                create table if not exists balances
                (
                    id            uuid                     default uuid_generate_v4() not null
                        constraint "PK_74904758e813e401abc3d4261c2"
                            primary key,
                    "balanceDate" date                                                not null,
                    balance       numeric                                             not null,
                    "userId"      uuid
                        constraint "FK_414a454532d03cd17f4ef40eae2"
                            references users,
                    "createdAt"   timestamp with time zone default now()              not null,
                    "updatedAt"   timestamp with time zone default now()              not null,
                    "deletedAt"   timestamp with time zone,
                    constraint "UQ_de4fe6284d2b42092f5af022a3e"
                        unique ("userId", "balanceDate")
                );
                 alter table balances owner to postgres;

                 create table attendances
                (
                    id          uuid                     default uuid_generate_v4() not null
                        constraint "PK_483ed97cd4cd43ab4a117516b69"
                            primary key,
                    date        date                                                not null,
                    status      varchar                                             not null,
                    "checkIn"   timestamp                                           not null,
                    "checkOut"  timestamp,
                    "userId"    uuid
                        constraint "FK_5e20bdbc6b72f0da23eb2ff1b60"
                            references users,
                    "createdAt" timestamp with time zone default now()              not null,
                    "updatedAt" timestamp with time zone default now()              not null,
                    "deletedAt" timestamp with time zone,
                    constraint "UQ_670284220e47cb165679195642f"
                        unique ("userId", date)
                );

                alter table attendances owner to postgres;

            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS companies;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS balances;
        DROP TABLE IF EXISTS attendances;
        `);
  }
}
