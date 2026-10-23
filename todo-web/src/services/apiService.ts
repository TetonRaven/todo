import type { Todo } from '../types/todo';
import type { TodoApi } from './todoApi';

const apiUrl: string = 'http://localhost:5293/api/todos';

export class ApiService implements TodoApi {
    async getAll() : Promise<Todo[]> {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Failed to load todos.');
        }

        return await response.json() as Todo[];
    }

    async getById(id: number) : Promise<Todo> {
        const response = await fetch(`${apiUrl}/${id}`);

        if (!response.ok) {
            throw new Error('Failed to load todo.');
        }

        return await response.json() as Todo;
    }

    async createTodo(todo: Todo) : Promise<Todo> {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to create todo.');
        }

        return await response.json() as Todo;
    }

    async updateTodo(todo: Todo) : Promise<void> {
        const response = await fetch(`${apiUrl}/${todo.id}`, {
            method: 'PUT',
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to update todo.');
        }
    }

    async deleteTodo(id: number) : Promise<void> {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete todos.');
        }
    }
}