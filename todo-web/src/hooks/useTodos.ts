import { useEffect, useState } from 'react';
import type { Todo } from '../types/todo';
import { useTodoApi } from './useTodoApi';

export function useTodos() {
    const apiService = useTodoApi();

    const [todos, setTodos] = useState<Todo[]>([]);    

    useEffect(() => {
        loadTodos();
    }, []);

  async function loadTodos() {
    const todoList = await apiService.getAll();
    setTodos(todoList);
  }

  async function createTodo(text: string) {
    await apiService.createTodo({
      text,
      completed: false
    });

    await loadTodos();
  }

  async function toggleCompleted(todo: Todo) {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed
    };

    await apiService.updateTodo(updatedTodo);

    await loadTodos();
  }

  async function deleteTodo(id: number) {
    await apiService.deleteTodo(id);
    await loadTodos();
  }

  return {
    todos,
    createTodo,
    toggleCompleted,
    deleteTodo,
  };
}