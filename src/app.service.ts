import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CreateRequestContext,
  EntityManager,
  EntityRepository,
} from '@mikro-orm/postgresql';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Recipe } from './entities/recipes.entity';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: EntityRepository<Recipe>,
    @Inject('KITCHEN') private client: ClientProxy,
    @Inject('ORDER') private readonly orderClient: ClientProxy,
    private readonly em: EntityManager,
  ) { }

  @CreateRequestContext()
  async handleOrderCreated(data: { orderId: string }) {
    const recipes = await this.recipeRepository.findAll({
      populate: ['recipeIngredients'],
    });
    const selectedRecipe = recipes[Math.floor(Math.random() * recipes.length)];

    console.log(selectedRecipe);

    const ingredientsRequest = selectedRecipe.recipeIngredients.map(ingredient => ({
      ingredientId: ingredient.ingredientId,
      quantity: ingredient.quantity,
    }));

    this.client.emit('ingredients_request', {
      orderId: data.orderId,
      recipeId: selectedRecipe.id,
      ingredients: ingredientsRequest,
    });
  }

  @CreateRequestContext()
  async handleIngredientAvailability(data: {
    orderId: string;
    recipeId: string;
    ingredients: { ingredientId: string; isAvailable: boolean }[];
  }) {
    const allAvailable = data.ingredients.every(ingredient => ingredient.isAvailable);

    if (allAvailable) {
      const recipe = await this.recipeRepository.findOne({ id: data.recipeId });
      this.orderClient.emit('order_completed', {
        orderId: data.orderId,
        recipeId: data.recipeId,
        recipeName: recipe.name,
      });
    } else {
      console.log(`Not all ingredients for order ${data.orderId} are available.`);
    }
  }

}
