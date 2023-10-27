import './global.scss';
import { AuthProvider } from './hooks/AuthContext/AuthContext';
import LandingPage from './components/Pages/LandingPage/landingpage';

function App() {

  return (
    <>
      <AuthProvider>
        <div className="app">
          <LandingPage />

        </div>
      </AuthProvider>
    </>
  )
}

export default App
