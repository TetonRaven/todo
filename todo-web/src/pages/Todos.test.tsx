import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Todos } from './Todos';
import { useTodos } from '../hooks/useTodos';

vi.mock('../hooks/useTodos', () => ({
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

    render(<Todos />);

    expect(screen.getByText('Learn React')).toBeTruthy();
  });
});

describe('when adding a todo', () => {
  it('shows an empty input when the add button is clicked', async () => {
    mockTodosHook();
    const user = userEvent.setup();

    render(<Todos />);
    await user.click(screen.getByRole('button', { name: '+ Add Task' }));

    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    expect(screen.queryByRole('button', { name: '+ Add Task' })).toBeNull();
  });

  it('disables the add button until text is entered', async () => {
    mockTodosHook();
    const user = userEvent.setup();

    render(<Todos />);
    await user.click(screen.getByRole('button', { name: '+ Add Task' }));

    const addButton = screen.getByRole('button', { name: 'Add' }) as HTMLButtonElement;
    expect(addButton.disabled).toBe(true);

    await user.type(screen.getByRole('textbox'), 'Buy milk');

    expect(addButton.disabled).toBe(false);
  });

  it('creates the todo with the entered text', async () => {
    const createTodo = vi.fn();
    mockTodosHook({ createTodo });
    const user = userEvent.setup();

    render(<Todos />);
    await user.click(screen.getByRole('button', { name: '+ Add Task' }));

    await user.type(screen.getByRole('textbox'), 'Buy milk');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(createTodo).toHaveBeenCalledWith('Buy milk');
  });

  it('hides the input after saving', async () => {
    mockTodosHook({ createTodo: vi.fn().mockResolvedValue(undefined) });
    const user = userEvent.setup();

    render(<Todos />);
    await user.click(screen.getByRole('button', { name: '+ Add Task' }));
    await user.type(screen.getByRole('textbox'), 'Buy milk');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('hides the input when cancel is clicked', async () => {
    mockTodosHook();
    const user = userEvent.setup();

    render(<Todos />);
    await user.click(screen.getByRole('button', { name: '+ Add Task' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByRole('button', { name: '+ Add Task' })).toBeTruthy();
  });
});

describe('when toggling a todo as completed', () => {
  it('calls toggleCompleted with the selected todo', async () => {
    const todo = { id: 1, text: 'Learn React', completed: false };
    const toggleCompleted = vi.fn();
    mockTodosHook({ todos: [todo], toggleCompleted });
    const user = userEvent.setup();

    render(<Todos />);
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

    render(<Todos />);
    await user.click(screen.getByRole('button', { name: 'Delete Learn React' }));

    expect(deleteTodo).toHaveBeenCalledWith(todo.id);
  });

  it('does not call deleteTodo when the todo has no id', async () => {
    const todo = { text: 'Learn React', completed: false };
    const deleteTodo = vi.fn();
    mockTodosHook({ todos: [todo], deleteTodo });
    const user = userEvent.setup();

    render(<Todos />);
    await user.click(screen.getByRole('button', { name: 'Delete Learn React' }));

    expect(deleteTodo).not.toHaveBeenCalled();
  });
});
