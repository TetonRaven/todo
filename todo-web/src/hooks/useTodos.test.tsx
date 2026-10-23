import { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { type TodoApi, TodoApiContext } from '../services/todoApi';
import { useTodos } from './useTodos';

const mockApi: TodoApi = {
  getAll: vi.fn().mockResolvedValue([]),
  getById: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn()
};

function wrapper({ children }: { children: ReactNode }) {
  return (
    <TodoApiContext.Provider value={mockApi}>
      {children}
    </TodoApiContext.Provider>
  );
}

describe('when getting the todos', () => {
  it('gets todos from the api', async () => {
    const expectedTodos = [
      { id: 1, text: 'Learn React', completed: false }
    ];

    mockApi.getAll = vi.fn().mockResolvedValue(expectedTodos);  

    const { result } = renderHook(() => useTodos(), { wrapper });

    await waitFor(() => {
      expect(result.current.todos).toEqual(expectedTodos);
    });

    expect(mockApi.getAll).toHaveBeenCalledOnce();
  });
});

describe('when creating a todo', () => {
  it('creates the todo via the api and reloads the todos', async () => {
    const newTodo = { id: 1, text: 'Learn TypeScript', completed: false };

    mockApi.getAll = vi.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([newTodo]);
    mockApi.createTodo = vi.fn().mockResolvedValue(newTodo);

    const { result } = renderHook(() => useTodos(), { wrapper });

    await waitFor(() => {
      expect(result.current.todos).toEqual([]);
    });

    await act(async () => {
      await result.current.createTodo('Learn TypeScript');
    });

    expect(mockApi.createTodo).toHaveBeenCalledWith({
      text: 'Learn TypeScript',
      completed: false
    });

    await waitFor(() => {
      expect(result.current.todos).toEqual([newTodo]);
    });

    expect(mockApi.getAll).toHaveBeenCalledTimes(2);
  });
});

describe('when toggling completed', () => {
  it('updates the todo via the api and reloads the todos', async () => {
    const todo = { id: 1, text: 'Learn React', completed: false };
    const toggledTodo = { ...todo, completed: true };

    mockApi.getAll = vi.fn()
      .mockResolvedValueOnce([todo])
      .mockResolvedValueOnce([toggledTodo]);
    mockApi.updateTodo = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useTodos(), { wrapper });

    await waitFor(() => {
      expect(result.current.todos).toEqual([todo]);
    });

    await act(async () => {
      await result.current.toggleCompleted(todo);
    });

    expect(mockApi.updateTodo).toHaveBeenCalledWith(toggledTodo);

    await waitFor(() => {
      expect(result.current.todos).toEqual([toggledTodo]);
    });
  });
});

describe('when deleting a todo', () => {
  it('deletes the todo via the api and reloads the todos', async () => {
    const todo = { id: 1, text: 'Learn React', completed: false };

    mockApi.getAll = vi.fn()
      .mockResolvedValueOnce([todo])
      .mockResolvedValueOnce([]);
    mockApi.deleteTodo = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useTodos(), { wrapper });

    await waitFor(() => {
      expect(result.current.todos).toEqual([todo]);
    });

    await act(async () => {
      await result.current.deleteTodo(todo.id!);
    });

    expect(mockApi.deleteTodo).toHaveBeenCalledWith(todo.id);

    await waitFor(() => {
      expect(result.current.todos).toEqual([]);
    });
  });
});