import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApiService } from './services/apiService';
import { TodoApiContext } from './services/todoApi';

const todoApi = new ApiService();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TodoApiContext.Provider value={todoApi}>
      <App />
    </TodoApiContext.Provider>
  </StrictMode>,
)
