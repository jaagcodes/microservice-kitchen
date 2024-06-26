import { InjectRepository } from '@mikro-orm/nestjs';
import {
    CreateRequestContext,
    EntityManager,
    EntityRepository,
} from '@mikro-orm/postgresql';
import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Recipe } from '../entities/recipes.entity';

@Injectable()
export class RecipeService {

    private readonly logger = new Logger(RecipeService.name);

    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: EntityRepository<Recipe>,
        @Inject('KITCHEN') private client: ClientProxy,
        @Inject('ORDER') private readonly orderClient: ClientProxy,
        private readonly em: EntityManager,
    ) { }

    @CreateRequestContext()
    async handleOrderCreated(data: { orderId: string }) {
        try {
            const recipes = await this.recipeRepository.findAll({
                populate: ['recipeIngredients'],
            });

            if (!recipes.length) {
                this.logger.error('No recipes found.');
                throw new NotFoundException('No recipes found');
            }

            this.logger.log(recipes);
            const selectedRecipe = recipes[Math.floor(Math.random() * recipes.length)];
            this.logger.log(`Selected recipe: ${selectedRecipe}`);

            const ingredientsRequest = selectedRecipe.recipeIngredients.map(ingredient => ({
                ingredientId: ingredient.ingredientId,
                quantity: ingredient.quantity,
            }));

            this.logger.log(`Requested ingredients: ${ingredientsRequest}`);
            this.client.emit('ingredients_request', {
                orderId: data.orderId,
                recipeId: selectedRecipe.id,
                ingredients: ingredientsRequest,
            });
            this.logger.log(`Ingredients request sent for order ${data.orderId}`);
        } catch (error) {
            this.logger.error(`Error handling order created: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error handling order created');
        }
    }

    @CreateRequestContext()
    async handleIngredientAvailability(data: {
        orderId: string;
        recipeId: string;
        ingredients: { ingredientId: string; isAvailable: boolean }[];
    }) {
        try {
            const allAvailable = data.ingredients.every(ingredient => ingredient.isAvailable);

            if (allAvailable) {
                const recipe = await this.recipeRepository.findOne({ id: data.recipeId });

                if (!recipe) {
                    this.logger.error(`Recipe with ID ${data.recipeId} not found.`);
                    throw new NotFoundException(`Recipe with ID ${data.recipeId} not found.`);
                }

                this.orderClient.emit('order_completed', {
                    orderId: data.orderId,
                    recipeId: data.recipeId,
                    recipeName: recipe.name,
                });
                this.logger.log(`Order ${data.orderId} completed with recipe ${data.recipeId}`);
            } else {
                this.logger.log(`Not all ingredients for order ${data.orderId} are available.`);
            }
        } catch (error) {
            this.logger.error(`Error handling ingredient availability: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error handling ingredient availability');
        }
    }

}
