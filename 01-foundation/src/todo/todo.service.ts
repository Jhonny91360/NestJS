import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Piedra del alma', done: false },
    { id: 2, description: 'Piedra del tiempo', done: false },
    { id: 3, description: 'Piedra del espacio', done: true },
  ];
  create(createTodoDto: CreateTodoDto): Todo {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      description: createTodoDto.description,
      done: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id);

    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const { description, done } = updateTodoDto;
    const todo = this.findOne(id);

    if (done !== undefined) {
      todo.done = done;
    }
    if (description) {
      todo.description = description;
    }

    this.todos = this.todos.map((todoItem) => {
      if (todoItem.id === id) {
        return todo;
      }
      return todoItem;
    });

    return todo;
  }

  remove(id: number) {
    this.findOne(id);
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }
}
