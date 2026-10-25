import { createBrowserRouter } from 'react-router';
import App from './App';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Todos } from './pages/Todos';
import { ErrorPage} from './pages/ErrorPage';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        ErrorBoundary: ErrorPage,
        children: [
          { index: true, element: <Home />, },
          { path: '/home', element: <Home /> },
          { path: '/todos', element: <Todos /> },
          { path: '/profile', element: <Profile /> },
          { path: '*', element: <NotFound />}
        ]
      }
    ]
  }
]);
