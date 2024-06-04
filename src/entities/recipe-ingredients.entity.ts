import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { Recipe } from './recipes.entity';

@Entity()
export class RecipeIngredient {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @ManyToOne(() => Recipe)
  recipe: Recipe;

  @Property()
  ingredientId: string;

  @Property()
  quantity: number;
}
