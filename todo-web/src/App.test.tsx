import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { useTodos } from './hooks/useTodos';

vi.mock('./hooks/useTodos', () => ({
  useTodos: vi.fn()
}));

// @testing-library/react's auto-cleanup relies on global afterEach, which isn't enabled in this config.
afterEach(cleanup);

const mockedUseTodos = vi.mocked(useTodos);

function mockTodosHook(overrides: Partial<ReturnType<typeof useTodos>> = {}) {
  mockedUseTodos.mockReturnValue({
    todos: [],
    createTodo: vi.fn(),
    toggleCompleted: vi.fn(),
    deleteTodo: vi.fn(),
    ...overrides
  });
}

describe('when displaying todos', () => {
  it('renders the todos from the hook', () => {
    mockTodosHook({ todos: [{ id: 1, text: 'Learn React', completed: false }] });

    render(<App />);

    expect(screen.getByText('Learn React')).toBeTruthy();
  });
});

describe('when adding a todo', () => {
  it('creates the todo with the entered text', async () => {
    const createTodo = vi.fn();
    mockTodosHook({ createTodo });
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole('button', { name: '+' }));

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Buy milk');
    await user.click(screen.getByRole('button', { name: '✅' }));

    expect(createTodo).toHaveBeenCalledWith('Buy milk');
  });
});

describe('when toggling a todo as completed', () => {
  it('calls toggleCompleted with the selected todo', async () => {
    const todo = { id: 1, text: 'Learn React', completed: false };
    const toggleCompleted = vi.fn();
    mockTodosHook({ todos: [todo], toggleCompleted });
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole('checkbox'));

    expect(toggleCompleted).toHaveBeenCalledWith(todo);
  });
});

describe('when deleting a todo', () => {
  it('calls deleteTodo with the selected todo id', async () => {
    const todo = { id: 1, text: 'Learn React', completed: false };
    const deleteTodo = vi.fn();
    mockTodosHook({ todos: [todo], deleteTodo });
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole('button', { name: '❌' }));

    expect(deleteTodo).toHaveBeenCalledWith(todo.id);
  });
});
