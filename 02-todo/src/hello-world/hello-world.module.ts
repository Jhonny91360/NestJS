import { Module } from '@nestjs/common';
import { HelloWorldResolver } from './hello-world.resolver';
import { Query } from '@nestjs/graphql';

@Module({
  providers: [HelloWorldResolver],
})
export class HelloWorldModule {
  @Query(() => String)
  helloWorld(): string {
    return 'Hello World!';
  }
}
