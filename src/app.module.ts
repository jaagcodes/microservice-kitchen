import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecipeService } from './services/recipe.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Recipe } from './entities/recipes.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature([Recipe]),
    ClientsModule.registerAsync([
      {
        name: 'KITCHEN',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
      },
      {
        name: 'ORDER',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
      }
    ]),
  ],
  controllers: [AppController],
  providers: [RecipeService],
})
export class AppModule {}
