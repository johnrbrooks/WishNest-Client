import './global.scss';
import { AuthProvider } from './hooks/AuthContext/AuthContext';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './components/Pages/LandingPage/landingpage';
import Navigation from './components/Navigation/navigation';
import FamilyLogin from './components/Pages/LoginPage/FamilyLogin/familylogin';
import About from './components/Pages/About/About';
import CreateFamily from './components/Pages/CreateFamilyPage/createfamily';
import UserLogin from './components/Pages/LoginPage/UserLogin/userlogin';
import UserDashboardLanding from './components/Pages/UserDashboardPage/UserDashboardLanding/userdashboardlanding';

function App() {

  useEffect(() => {
    //check for token, if no token, navigate to signin
  }, [])

  return (
    <>
      <AuthProvider>
        <div className="app">
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/signin" element={<FamilyLogin />}/>
            <Route path="/userlogin" element={<UserLogin />}/>
            <Route path="/family/signup" element={<CreateFamily />}/>
            <Route path="/dashboard" element={<UserDashboardLanding />}/>
          </Routes>

        </div>
      </AuthProvider>
    </>
  )
}

export default App
