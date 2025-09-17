import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field(() => String, { description: 'what needs to be done?' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  description: string;
}
