import { useState, type ChangeEvent } from 'react'

import './App.css'

import type { Todo } from './types/todo';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, createTodo, toggleCompleted, deleteTodo } = useTodos();
  const [newTodoText, setNewTodoText] = useState<string | null>(null);

  function addButtonClick() {
    if (newTodoText != null) {
      return;
    }

    setNewTodoText('New Todo');
  }

  async function saveNewClick() {
    if (!newTodoText) {
      return;
    }

    await createTodo(newTodoText);

    setNewTodoText(null);
  }

  async function completedClick(todo: Todo) {
    if (!todo) {
      return;
    }

    await toggleCompleted(todo);
  }

  async function deleteTodoClick(id: number | undefined) {
    if (!id) {
      return;
    }

    await deleteTodo(id);
  }

  function newTodoTextChanged(e: ChangeEvent<HTMLInputElement>) {
    if (newTodoText == null) {
      return;
    }

    setNewTodoText(e.target.value)
  }

  return (
    <>
      <h1>To Do</h1>

      <div style={{ marginBottom: '10px' }}><button onClick={addButtonClick}>+</button></div>

      {newTodoText != null &&
          <div>
            <input type='text' value={ newTodoText } onChange={newTodoTextChanged} />
            <button style={{ border: 'none', backgroundColor: 'inherit'}} onClick={saveNewClick}>&#x2705;</button>
          </div>
      }

      { todos.map(todo => (
        <div key={todo.id}>
          <input 
            type="checkbox"
            checked={todo.completed}
            onChange={() => completedClick(todo)}
          />
          {todo.text}
          <button style={{ border: 'none', backgroundColor: 'inherit'}} onClick={() => deleteTodoClick(todo.id)}>&#x274C;</button>
        </div>)) 
      }
    </>
  )
}

export default App
