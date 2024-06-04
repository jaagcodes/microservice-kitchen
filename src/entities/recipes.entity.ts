import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { RecipeIngredient } from './recipe-ingredients.entity';

@Entity()
export class Recipe {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property()
  name: string;

  @Property()
  description: string;

  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.recipe,
  )
  recipeIngredients = new Collection<RecipeIngredient>(this);

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
