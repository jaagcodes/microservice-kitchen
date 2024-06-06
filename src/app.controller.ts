import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('order_created')
  async handleOrderCreated(data: { orderId: string }) {
    await this.appService.handleOrderCreated(data);
  }

  @EventPattern('ingredient_availability')
  async handleIngredientAvailability(data: {
    orderId: string;
    recipeId: string;
    ingredients: { ingredientId: string; isAvailable: boolean }[];
  }) {
    await this.appService.handleIngredientAvailability(data);
  }
}
