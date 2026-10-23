import { createContext } from 'react';
import type { Todo } from '../types/todo';

export interface TodoApi {
  getAll(): Promise<Todo[]>;
  getById(id: number) : Promise<Todo>;
  createTodo(todo: Todo): Promise<Todo>;
  updateTodo(todo: Todo): Promise<void>;
  deleteTodo(id: number): Promise<void>;
}

export const TodoApiContext = createContext<TodoApi | null>(null);