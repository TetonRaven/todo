import { useState, type ChangeEvent } from 'react';
import './Todos.css';
import type { Todo } from '../types/todo';
import { useTodos } from '../hooks/useTodos';

export function Todos() {
   const { todos, createTodo, toggleCompleted, deleteTodo } = useTodos();
   const [showNew, setShowNew] = useState(false);
   const [newTodoText, setNewTodoText] = useState('');

   function addButtonClick() {
      if (showNew) {
         return;
      }

      setNewTodoText('');
      setShowNew(true);
   }

   function cancelAddButtonClick() {
      setShowNew(false);
   }

   async function saveNewClick() {
      if (!newTodoText) {
         return;
      }

      await createTodo(newTodoText);

      setShowNew(false);
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
         <div className='todo-header'>
            <h1 className='page-title'>To Do</h1>

            {!showNew && 
               <button className='todo-add' onClick={addButtonClick}>+ Add Task</button>         
            }            
         </div>

         {showNew &&
            <form className='todo-new' onSubmit={saveNewClick}>
               <input
                  type='text'
                  placeholder='What needs to be done?'
                  value={newTodoText}
                  onChange={newTodoTextChanged}
                  autoFocus
               />

               <button type='submit' className='add' disabled={!newTodoText.trim()}>Add</button>
               <button className='cancel' onClick={cancelAddButtonClick}>Cancel</button>
            </form>
         }

         <div className='todo-list'>
            { todos.map(todo => (
               <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input 
                     type="checkbox"
                     checked={todo.completed}
                     onChange={() => completedClick(todo)}
                  />
                  <span className='todo-text'>{todo.text}</span>
                  <button 
                     className="todo-delete"
                     onClick={() => deleteTodoClick(todo.id)}
                     aria-label={`Delete ${todo.text}`}
                  >
                     &#x274C;
                  </button>
               </div>)) 
            }            
         </div>                  
      </>
   );
}