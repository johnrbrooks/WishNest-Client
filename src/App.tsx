import './global.scss';
import { AuthProvider } from './hooks/AuthContext/AuthContext';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/Pages/LandingPage/landingpage';
import Navigation from './components/Navigation/navigation';
import FamilyLogin from './components/Pages/LoginPage/FamilyLogin/familylogin';
import About from './components/Pages/About/About';

function App() {

  return (
    <>
      <AuthProvider>
        <div className="app">
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/signin" element={<FamilyLogin />}/>
          </Routes>

        </div>
      </AuthProvider>
    </>
  )
}

export default App
