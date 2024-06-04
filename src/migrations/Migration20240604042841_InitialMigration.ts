import { Migration } from '@mikro-orm/migrations';

export class Migration20240604042841_InitialMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "recipe" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, constraint "recipe_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "recipe_ingredient" ("id" uuid not null, "recipe_id" uuid not null, "ingredient_id" varchar(255) not null, "quantity" int not null, constraint "recipe_ingredient_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "recipe_ingredient" add constraint "recipe_ingredient_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "recipe_ingredient" drop constraint "recipe_ingredient_recipe_id_foreign";',
    );

    this.addSql('drop table if exists "recipe" cascade;');

    this.addSql('drop table if exists "recipe_ingredient" cascade;');
  }
}
