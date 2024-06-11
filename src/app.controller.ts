import { Controller, Get, InternalServerErrorException, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { RecipeService } from './services/recipe.service';
import { HealthCheckService } from './services/health-check.service';

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly recipeService: RecipeService,
    private readonly healthCheckService: HealthCheckService,
  ) { }

  @Get('health')
    getHealthStatus(): string {
      try {
        this.logger.log('Checking health status');
        return this.healthCheckService.getHealthStatus();
      } catch (error) {
        this.logger.error('Error checking health status', error.stack);
        throw new InternalServerErrorException('Error checking health status');
      }
    }

  @EventPattern('order_created')
  async handleOrderCreated(data: { orderId: string }) {
    try {
      this.logger.log(`Handling order created event for order ID ${data.orderId}`);
      await this.recipeService.handleOrderCreated(data);
      this.logger.log(`Order created event handled for order ID ${data.orderId}`);
    } catch (error) {
      this.logger.error(`Error handling order created event for order ID ${data.orderId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error handling order created event');
    }
  }

  @EventPattern('ingredient_availability')
  async handleIngredientAvailability(data: {
    orderId: string;
    recipeId: string;
    ingredients: { ingredientId: string; isAvailable: boolean }[];
  }) {
    try {
      this.logger.log(`Handling ingredient availability event for order ID ${data.orderId}`);
      await this.recipeService.handleIngredientAvailability(data);
      this.logger.log(`Ingredient availability event handled for order ID ${data.orderId}`);
    } catch (error) {
      this.logger.error(`Error handling ingredient availability event for order ID ${data.orderId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error handling ingredient availability event');
    }
  }
}
