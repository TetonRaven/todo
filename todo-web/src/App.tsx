import { Outlet, NavLink } from 'react-router';
import './App.css';

function App() {

  return (
    <div className='app'>
      <header className='app-header'>
        <div className='app-container'>
          <h1 className='app-title'>Enterprise To Do</h1>

          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/todos">To Do</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </nav>        
        </div>        
      </header>
      
      <main className='app-main app-container'>
        <Outlet />
      </main>      
    </div>
  )
}

export default App
