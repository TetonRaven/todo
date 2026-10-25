import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router";
import './index.css';
import { router } from './routes';
import { ApiService } from './services/apiService';
import { TodoApiContext } from './services/todoApi';

const todoApi = new ApiService();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TodoApiContext.Provider value={todoApi}>
      <RouterProvider router={router} />
    </TodoApiContext.Provider>
  </StrictMode>,
)