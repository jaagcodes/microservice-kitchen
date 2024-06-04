import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';

import { RecipeIngredient } from '../entities/recipe-ingredients.entity';
import { Recipe } from '../entities/recipes.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const recipes = [
      {
        name: 'Tomato Salad',
        description: 'A fresh tomato salad with lemon and lettuce.',
        ingredients: [
          { ingredientId: 'c7aa782f-86dd-4b1d-8381-5c2b53135d27', quantity: 2 }, // tomato
          { ingredientId: '1dcb0ba4-4485-44d0-a048-5c2a64be4d88', quantity: 1 }, // lemon
          { ingredientId: 'da0d5af9-891d-4d30-9879-85ab569c723d', quantity: 1 }, // lettuce
        ],
      },
      {
        name: 'Potato Rice',
        description: 'Delicious rice mixed with potatoes and onions.',
        ingredients: [
          { ingredientId: 'b525c3b3-5f36-4d20-81a8-6cd93cf74566', quantity: 3 }, // potato
          { ingredientId: 'd3d3ad87-f23e-47b5-b05e-45bb4a7775a1', quantity: 2 }, // rice
          { ingredientId: 'f6217e05-da07-4e71-aca2-6984748239e6', quantity: 1 }, // onion
        ],
      },
      {
        name: 'Cheesy Meatloaf',
        description: 'A savory meatloaf with melted cheese.',
        ingredients: [
          { ingredientId: 'e19e08a8-9efd-4134-84cf-08443c55637b', quantity: 2 }, // meat
          { ingredientId: 'ae6ce2e1-a866-4459-a9f9-8aa079034d4e', quantity: 1 }, // cheese
          { ingredientId: 'f6217e05-da07-4e71-aca2-6984748239e6', quantity: 1 }, // onion
        ],
      },
      {
        name: 'Chicken Stir Fry',
        description: 'A quick and tasty chicken stir fry.',
        ingredients: [
          { ingredientId: '5b00b056-ef72-4bba-896c-4b62239df525', quantity: 2 }, // chicken
          { ingredientId: 'c7aa782f-86dd-4b1d-8381-5c2b53135d27', quantity: 1 }, // tomato
          { ingredientId: '1dcb0ba4-4485-44d0-a048-5c2a64be4d88', quantity: 1 }, // lemon
        ],
      },
      {
        name: 'Lemon Rice',
        description: 'A refreshing lemon-flavored rice dish.',
        ingredients: [
          { ingredientId: 'd3d3ad87-f23e-47b5-b05e-45bb4a7775a1', quantity: 3 }, // rice
          { ingredientId: '1dcb0ba4-4485-44d0-a048-5c2a64be4d88', quantity: 2 }, // lemon
          { ingredientId: 'f6217e05-da07-4e71-aca2-6984748239e6', quantity: 1 }, // onion
        ],
      },
      {
        name: 'Ketchup Chicken',
        description: 'A tangy chicken dish with ketchup.',
        ingredients: [
          { ingredientId: '5b00b056-ef72-4bba-896c-4b62239df525', quantity: 2 }, // chicken
          { ingredientId: '71bf82a6-5701-4931-b3ba-bfb8a0146fcc', quantity: 2 }, // ketchup
          { ingredientId: 'b525c3b3-5f36-4d20-81a8-6cd93cf74566', quantity: 1 }, // potato
        ],
      },
    ];

    for (const recipeData of recipes) {
      const recipe = new Recipe(recipeData.name, recipeData.description);
      em.persist(recipe);

      for (const ingredient of recipeData.ingredients) {
        const recipeIngredient = new RecipeIngredient();
        recipeIngredient.recipe = recipe;
        recipeIngredient.ingredientId = ingredient.ingredientId;
        recipeIngredient.quantity = ingredient.quantity;
        em.persist(recipeIngredient);
      }
    }

    await em.flush();
  }
}