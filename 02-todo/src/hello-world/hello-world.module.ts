import { Module } from '@nestjs/common';
import { HelloWorldResolver } from './hello-world.resolver';
import { Args, Float, Int, Query } from '@nestjs/graphql';

@Module({
  providers: [HelloWorldResolver],
})
export class HelloWorldModule {
  @Query(() => String, {
    description: 'This returns a string hello world',
    name: 'helloWorldQuery',
  })
  helloWorld(): string {
    return 'Hello World!';
  }

  @Query(() => Float, {
    description: 'This returns a random float',
    name: 'randomFloatQuery',
  })
  randomFloat(): number {
    return Math.random();
  }

  @Query(() => Int, {
    description:
      'This returns an integer number between 0 and argument "to" default 6',
    name: 'randomFromZeroTo',
  })
  getRandomFromZeroTo(
    @Args('to', { type: () => Int, nullable: true, defaultValue: 6 })
    to: number = 6,
  ): number {
    return Math.floor(Math.random() * to);
  }
}
