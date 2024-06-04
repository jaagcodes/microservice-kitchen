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
          { ingredientId: '3fb6666c-e52d-4e78-a9ac-b2123b41e770', quantity: 2 }, // tomato
          { ingredientId: '6daabbd5-6a5c-46c7-8dbb-4d43436d98fc', quantity: 1 }, // lemon
          { ingredientId: '9bce6215-6a3f-4968-b23a-f7bad092e814', quantity: 1 }, // lettuce
        ],
      },
      {
        name: 'Potato Rice',
        description: 'Delicious rice mixed with potatoes and onions.',
        ingredients: [
          { ingredientId: 'b525c3b3-5f36-4d20-81a8-6cd93cf74566', quantity: 3 }, // potato
          { ingredientId: '0f31de29-1d87-468a-893f-e1f6eec52551', quantity: 2 }, // rice
          { ingredientId: '05b68ede-7a7f-42cc-8177-277f7711d38d', quantity: 1 }, // onion
        ],
      },
      {
        name: 'Cheesy Meatloaf',
        description: 'A savory meatloaf with melted cheese.',
        ingredients: [
          { ingredientId: '65b08f0e-84db-493b-b21f-4fba2466dbf2', quantity: 2 }, // meat
          { ingredientId: '081258a4-147d-4043-932d-cbd825880174', quantity: 1 }, // cheese
          { ingredientId: '05b68ede-7a7f-42cc-8177-277f7711d38d', quantity: 1 }, // onion
        ],
      },
      {
        name: 'Chicken Stir Fry',
        description: 'A quick and tasty chicken stir fry.',
        ingredients: [
          { ingredientId: '2ed8bf8e-0bb9-44b9-8688-5ef309eeb1af', quantity: 2 }, // chicken
          { ingredientId: '3fb6666c-e52d-4e78-a9ac-b2123b41e770', quantity: 1 }, // tomato
          { ingredientId: '6daabbd5-6a5c-46c7-8dbb-4d43436d98fc', quantity: 1 }, // lemon
        ],
      },
      {
        name: 'Lemon Rice',
        description: 'A refreshing lemon-flavored rice dish.',
        ingredients: [
          { ingredientId: '0f31de29-1d87-468a-893f-e1f6eec52551', quantity: 3 }, // rice
          { ingredientId: '6daabbd5-6a5c-46c7-8dbb-4d43436d98fc', quantity: 2 }, // lemon
          { ingredientId: '05b68ede-7a7f-42cc-8177-277f7711d38d', quantity: 1 }, // onion
        ],
      },
      {
        name: 'Ketchup Chicken',
        description: 'A tangy chicken dish with ketchup.',
        ingredients: [
          { ingredientId: '2ed8bf8e-0bb9-44b9-8688-5ef309eeb1af', quantity: 2 }, // chicken
          { ingredientId: 'a4c7aa4a-6daa-4763-8d1e-85f725537d32', quantity: 2 }, // ketchup
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
