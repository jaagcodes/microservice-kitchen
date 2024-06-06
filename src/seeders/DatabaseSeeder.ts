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
          { ingredientId: '3c20a548-54ca-4837-b4fa-42cc6a8f6f3d', quantity: 2 }, // tomato
          { ingredientId: '6f133c8e-f5cc-40cd-ba93-3e5b8ccafcaa', quantity: 1 }, // lemon
          { ingredientId: '447ddeb4-0bc4-4ffe-947a-341bd2b62c1c', quantity: 1 }, // lettuce
        ],
      },
      {
        name: 'Potato Rice',
        description: 'Delicious rice mixed with potatoes and onions.',
        ingredients: [
          { ingredientId: 'b2b804a2-00b2-4f0b-968f-b2e2de35a88a', quantity: 3 }, // potato
          { ingredientId: 'e1e58900-26ef-49fe-97cd-25a163fec01d', quantity: 2 }, // rice
          { ingredientId: '66926bb2-6307-45b0-955d-459727fa19f4', quantity: 1 }, // onion
        ],
      },
      {
        name: 'Cheesy Meatloaf',
        description: 'A savory meatloaf with melted cheese.',
        ingredients: [
          { ingredientId: 'e13c92ba-0f00-40c1-9d81-304a83fb1f92', quantity: 2 }, // meat
          { ingredientId: '7e057b0e-b493-4169-9195-ab2037b6e377', quantity: 1 }, // cheese
          { ingredientId: '66926bb2-6307-45b0-955d-459727fa19f4', quantity: 1 }, // onion
        ],
      },
      {
        name: 'Chicken Stir Fry',
        description: 'A quick and tasty chicken stir fry.',
        ingredients: [
          { ingredientId: '72c6d6c2-e577-41a0-8e43-c9cdec9ecdbf', quantity: 2 }, // chicken
          { ingredientId: '3c20a548-54ca-4837-b4fa-42cc6a8f6f3d', quantity: 1 }, // tomato
          { ingredientId: '6f133c8e-f5cc-40cd-ba93-3e5b8ccafcaa', quantity: 1 }, // lemon
        ],
      },
      {
        name: 'Lemon Rice',
        description: 'A refreshing lemon-flavored rice dish.',
        ingredients: [
          { ingredientId: 'e1e58900-26ef-49fe-97cd-25a163fec01d', quantity: 3 }, // rice
          { ingredientId: '6f133c8e-f5cc-40cd-ba93-3e5b8ccafcaa', quantity: 2 }, // lemon
          { ingredientId: '66926bb2-6307-45b0-955d-459727fa19f4', quantity: 1 }, // onion
        ],
      },
      {
        name: 'Ketchup Chicken',
        description: 'A tangy chicken dish with ketchup.',
        ingredients: [
          { ingredientId: '72c6d6c2-e577-41a0-8e43-c9cdec9ecdbf', quantity: 2 }, // chicken
          { ingredientId: '1e9a216a-47a8-4df8-ab03-7d5f58f4267d', quantity: 2 }, // ketchup
          { ingredientId: 'b2b804a2-00b2-4f0b-968f-b2e2de35a88a', quantity: 1 }, // potato
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