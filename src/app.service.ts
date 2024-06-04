import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CreateRequestContext,
  EntityManager,
  EntityRepository,
} from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Recipe } from './entities/recipes.entity';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: EntityRepository<Recipe>,
    @Inject('KITCHEN') private client: ClientProxy,
    private readonly em: EntityManager,
  ) {}

  @CreateRequestContext()
  async handleOrderCreated(data: { orderId: string }) {
    const recipes = await this.recipeRepository.findAll({
      populate: ['recipeIngredients'],
    });
    const selectedRecipe = recipes[Math.floor(Math.random() * recipes.length)];

    console.log(selectedRecipe);

    for (const ingredient of selectedRecipe.recipeIngredients) {
      this.client.emit('ingredient_request', {
        orderId: data.orderId,
        recipeId: selectedRecipe.id,
        ingredientId: ingredient.ingredientId,
        quantity: ingredient.quantity,
      });
    }
  }
}
