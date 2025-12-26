import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';
import { Console } from 'console';

@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault({})],
        context: ({ req }) => {
          // todo to use this logic , we need to separete login an signup , those service doesn't need a token
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          // const token = req.headers?.authorization?.replace('Bearer ', '');
          // if (!token) throw new Error('Token needed');
          // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
          // const payload = jwtService.decode(token);
          // if (!payload) throw new Error('Token not valid');
        },
      }),
    }),
    // todo basic configuration
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   // debug: false,
    //   playground: false,
    //   plugins: [ApolloServerPluginLandingPageLocalDefault({})],
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    // }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl:
        process.env.STATE === 'prod'
          ? {
              rejectUnauthorized: false, // it's depends on your deployment site
              // sslmode: 'require',
            }
          : false,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) ?? 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log('State :', process.env.STATE);
    console.log('Port :', process.env.DB_PORT);
    console.log('Database host :', process.env.DB_HOST);
    console.log('Database :', process.env.DB_NAME);
    console.log('username :', process.env.DB_USERNAME);
  }
}
